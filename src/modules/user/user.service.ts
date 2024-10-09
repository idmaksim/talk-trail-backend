import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { I18nService } from 'nestjs-i18n';
import { getCurrentLang } from 'src/i18n/utils';
import { SignUpUserDto } from '../auth/dto';
import { RoleService } from '../role/role.service';
import { PasswordService } from '../cache/password/password.service';
import { CacheService } from '../cache/cache.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
    private readonly cacheService: CacheService,
  ) {}

  async create({ person, ...userDto }: SignUpUserDto) {
    const [
      userRoleUuid,
      hashedPassword,
      userExistsByEmail,
      userExistsByUsername,
    ] = await Promise.all([
      this.getUserRole(),
      this.passwordService.hashPassword(userDto.password),
      this.userRepository.existsByEmail(userDto.email),
      this.userRepository.existsByUsername(userDto.username),
    ]);
    if (userExistsByUsername || userExistsByEmail) {
      const errorKey = userExistsByUsername
        ? 'already_exists_username'
        : 'already_exists_email';
      this.logger.error(
        `Пользователь с email ${userDto.email} или username ${userDto.username} уже существует`,
      );
      throw new ConflictException(
        this.i18n.t(`errors.user.${errorKey}`, {
          lang: getCurrentLang(),
        }),
      );
    }
    try {
      return await this.userRepository.create(
        {
          ...userDto,
          person: {
            create: person,
          },
        },
        hashedPassword,
        userRoleUuid,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error('В кэше хранился неверный uuid роли');
        this.logger.log('Получаем uuid роли пользователя из базы данных');
        const userRole = await this.roleService.findOneByName('user');
        this.logger.log('Сохраняем uuid роли пользователя в кэше');
        await this.cacheService.set('user_role_uuid', userRole.uuid);
        return await this.userRepository.create(
          {
            ...userDto,
            person: {
              create: person,
            },
          },
          hashedPassword,
          userRole.uuid,
        );
      }
    }
  }

  async findOneByUuid(uuid: string, withPassword: boolean = true) {
    const user = await this.userRepository.findOneByUuid(uuid);
    if (!user) {
      this.logger.error(`Пользователь с uuid ${uuid} не найден`);
      throw new NotFoundException(
        this.i18n.t('errors.user.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
    this.logger.log(`Пользователь с uuid ${uuid} найден`);
    const { password, ...userWithoutSensitiveInfo } = user;
    if (!withPassword) {
      return userWithoutSensitiveInfo;
    }
    return { ...userWithoutSensitiveInfo, password };
  }

  async findOneByEmail(email: string, withPassword: boolean = true) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      this.logger.error(`Пользователь с email ${email} не найден`);
      throw new NotFoundException(
        this.i18n.t('errors.user.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
    this.logger.log(`Пользователь с email ${email} найден`);
    const { password, ...userWithoutSensitiveInfo } = user;
    if (!withPassword) {
      return userWithoutSensitiveInfo;
    }
    return { ...userWithoutSensitiveInfo, password };
  }

  private async getUserRole() {
    if (await this.cacheService.existsByKey('user_role_uuid')) {
      this.logger.log('Получение роли пользователя из кэша');
      return this.cacheService.get('user_role_uuid') as Promise<string>;
    }
    const userRole = await this.roleService.findOneByName('user');
    this.logger.log('Получение роли пользователя из базы данных');
    await this.cacheService.set('user_role_uuid', userRole.uuid);
    this.logger.log('Сохранение uuid роли пользователя в кэше');
    return userRole.uuid;
  }
}
