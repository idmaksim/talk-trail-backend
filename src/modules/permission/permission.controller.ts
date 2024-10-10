import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ActiveGuard } from '../auth/guards/active.guard';
import { PermissionGuard } from '../role-permission/guards/permission.guard';
import { HasPermissions } from '../role-permission/decorators/permissions.decorator';
import { PermissionEnum } from 'src/common/constants/permission.enum';
import { PermissionResponseDto } from '../../common/swagger/permission/res';
import { Description, Summary } from 'src/common/swagger/permission';

@ApiTags('Управление правами доступа')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @HasPermissions(PermissionEnum.PermissionGetAll)
  @ApiOperation({
    summary: Summary.findAllPermissions,
    description: Description.findAllPermissions,
  })
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get(':uuid')
  @ApiOkResponse({ type: PermissionResponseDto })
  @HasPermissions(PermissionEnum.PermissionGet)
  @ApiOperation({
    summary: Summary.findOnePermission,
    description: Description.findOnePermission,
  })
  async findOne(@Param('uuid') uuid: string) {
    return this.permissionService.findOne(uuid);
  }
}
