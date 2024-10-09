import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { I18nService } from 'nestjs-i18n';
import { getCurrentLang } from 'src/i18n/utils';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger('Permission');

  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly i18n: I18nService,
  ) {}

  async findAll() {
    const permissions = await this.permissionRepository.findAll();
    if (!permissions.length) {
      this.logger.error(`Права не найдены`);
      throw new NotFoundException(
        this.i18n.t('errors.permission.not_found_many', {
          lang: getCurrentLang(),
        }),
      );
    }
    this.logger.log(`Права найдены: ${permissions.length}`);
    return permissions;
  }

  async findOne(uuid: string) {
    const permission = await this.permissionRepository.findOne(uuid);
    if (!permission) {
      this.logger.error(`Право ${uuid} не найдено`);
      throw new NotFoundException(
        this.i18n.t('errors.permission.not_found', {
          lang: getCurrentLang(),
        }),
      );
    }
    this.logger.log(`Право ${permission.name} найдено`);
    return permission;
  }

  async exists(uuid: string) {
    return this.permissionRepository.existsByUuid(uuid);
  }

  async existsMany(uuids: string[]): Promise<boolean> {
    return this.permissionRepository.existsMany(uuids);
  }
}
