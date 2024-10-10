import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from '../role-permission.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PermissionEnum } from 'src/common/constants/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesPermissionsService: RolePermissionService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getHandler(), context.getClass()]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const hasAllPermissions = await this._hasAllPermissions(
      requiredPermissions,
      user.uuid,
    );
    if (!hasAllPermissions) {
      throw new ForbiddenException(
        this.i18n.t('errors.user.access_denied', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return true;
  }

  private async _hasAllPermissions(
    requiredPermissions: PermissionEnum[],
    userUuid: string,
  ): Promise<boolean> {
    const permissionsCheckResults = await Promise.all(
      requiredPermissions.map((permission) =>
        this.rolesPermissionsService.checkPermission(permission, userUuid),
      ),
    );
    return permissionsCheckResults.every((result) => result);
  }
}
