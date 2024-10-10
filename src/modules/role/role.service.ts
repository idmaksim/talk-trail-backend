import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { RoleCreateDto, RoleUpdateDto } from './dto';
import { PermissionService } from '../permission/permission.service';
import { RoleRepository } from './role.repository';
import { PrismaService } from '../app/prisma.service';
import { getCurrentLang } from 'src/i18n/utils';

@Injectable()
export class RoleService {
  private readonly logger = new Logger('RoleService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly roleRepository: RoleRepository,
    private readonly i18n: I18nService,
    private readonly permissionService: PermissionService,
  ) {}

  async create({ permissions, ...roleDto }: RoleCreateDto) {
    this.logger.log(`Создание роли ${roleDto.name}`);
    await Promise.all([
      this.ensureRoleNameUnique(roleDto.name),
      this.ensurePermissionsAreUnique(permissions),
      this.ensurePermissionsExist(permissions),
    ]);
    return this.prisma.$transaction(async (transactionClient) => {
      const newRole = await this.roleRepository.create(
        roleDto,
        transactionClient,
      );
      await this.roleRepository.createRolePermissions(
        permissions.map((permissionUuid) => ({
          roleUuid: newRole.uuid,
          permissionUuid,
        })),
        transactionClient,
      );
      return newRole;
    });
  }

  async update(roleUuid: string, { permissions, ...roleDto }: RoleUpdateDto) {
    await Promise.all([
      this.ensureRoleExists(roleUuid),
      this.ensurePermissionsAreUnique(permissions),
      this.ensurePermissionsExist(permissions),
    ]);

    return this.prisma.$transaction(async (transactionClient) => {
      const updatedRole = await this.roleRepository.update(
        roleUuid,
        roleDto,
        transactionClient,
      );
      await this.roleRepository.deleteRolePermissions(
        roleUuid,
        transactionClient,
      );
      await this.roleRepository.createRolePermissions(
        permissions.map((permissionUuid) => ({
          roleUuid,
          permissionUuid,
        })),
        transactionClient,
      );
      return updatedRole;
    });
  }

  async findOne(uuid: string) {
    const role = await this.roleRepository.findById(uuid);
    this.logger.log(`Получение роли ${uuid}`);
    if (!role) {
      this.logger.error(`Роль ${uuid} не найдена`);
      throw new NotFoundException(
        this.i18n.t('errors.role.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
    return role;
  }

  async findOneByName(name: string) {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      this.logger.error(`Роль ${name} не найдена`);
      throw new NotFoundException(
        this.i18n.t('errors.role.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
    return role;
  }

  async findAll() {
    const roles = await this.roleRepository.findAll();
    if (!roles.length) {
      this.logger.error(`Роли не найдены`);
      throw new NotFoundException(
        this.i18n.t('errors.role.not_found_many', {
          lang: getCurrentLang(),
        }),
      );
    }
    this.logger.log(`Получение всех ролей`);
    return roles;
  }

  async delete(uuid: string) {
    await this.ensureRoleExists(uuid);
    this.logger.log(`Удаление роли ${uuid}`);
    return this.roleRepository.delete(uuid);
  }

  private async ensureRoleNameUnique(name: string) {
    if (await this.roleRepository.existsByName(name)) {
      this.logger.error(`Роль ${name} уже существует`);
      throw new ConflictException(
        this.i18n.t('errors.role.exists', {
          lang: getCurrentLang(),
        }),
      );
    }
  }

  private async ensureRoleExists(uuid: string) {
    if (!(await this.roleRepository.existsByUuid(uuid))) {
      this.logger.error(`Роль ${uuid} не найдена`);
      throw new NotFoundException(
        this.i18n.t('errors.role.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
  }

  private async ensurePermissionsAreUnique(permissions: string[]) {
    if (new Set(permissions).size !== permissions.length) {
      this.logger.error(`Разрешения не уникальны`);
      throw new BadRequestException(
        this.i18n.t('errors.permission.duplicate', {
          lang: getCurrentLang(),
        }),
      );
    }
  }

  private async ensurePermissionsExist(permissions: string[]) {
    if (!(await this.permissionService.existsMany(permissions))) {
      this.logger.error(`Разрешения не найдены`);
      throw new NotFoundException(
        this.i18n.t('errors.permission.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
  }
}
