import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const canActivate = await this.userService.findOneByUuid(user.uuid);
    if (canActivate.isActive && !canActivate.isForbidden) {
      return true;
    } else if (!canActivate.isActive) {
      throw new ForbiddenException(
        this.i18n.t('errors.user.deactivated', {
          lang: I18nContext.current().lang,
        }),
      );
    } else if (canActivate.isForbidden) {
      throw new UnauthorizedException(
        this.i18n.t('errors.user.forbidden', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    throw new UnauthorizedException();
  }
}
