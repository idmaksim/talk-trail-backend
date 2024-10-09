import { Injectable, Logger } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class RolePermissionService {
  private readonly logger = new Logger('RolePermissionService');

  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly userService: UserService,
  ) {}

  async checkPermission(permission: string, userUuid: string) {
    const userRoleUuid = await this.getUserRoleUuid(userUuid);
    const rolePermissions =
      await this.rolePermissionRepository.findPermissionsByRoleUuid(
        userRoleUuid,
      );
    this.logger.log(`Получаем разрешения роли ${userRoleUuid}`);
    return rolePermissions.some(
      (rolePermission) => rolePermission.permission.name === permission,
    );
  }

  private async getUserRoleUuid(userUuid: string) {
    const user = await this.userService.findOneByUuid(userUuid);
    this.logger.log(`Получаем uuid роли пользователя ${userUuid}`);
    return user.role.uuid;
  }
}
