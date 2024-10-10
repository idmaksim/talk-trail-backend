import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCreateDto, RoleUpdateDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ActiveGuard } from '../auth/guards/active.guard';
import { PermissionGuard } from '../role-permission/guards/permission.guard';
import { HasPermissions } from '../role-permission/decorators/permissions.decorator';
import { PermissionEnum } from 'src/common/constants/permission.enum';
import { RoleResponseDto } from '../../common/swagger/role/res';
import { Description, Summary } from 'src/common/swagger/role';

@ApiTags('Управление ролями')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiCreatedResponse({ type: RoleResponseDto })
  @HasPermissions(PermissionEnum.RoleCreate)
  @ApiOperation({
    summary: Summary.createRole,
    description: Description.createRole,
  })
  async create(@Body() roleDto: RoleCreateDto) {
    return this.roleService.create(roleDto);
  }

  @Get(':uuid')
  @ApiCreatedResponse({ type: RoleResponseDto })
  @HasPermissions(PermissionEnum.RoleGet)
  @ApiOperation({
    summary: Summary.findOneRole,
    description: Description.findOneRole,
  })
  async findOne(@Param('uuid') uuid: string) {
    return this.roleService.findOne(uuid);
  }

  @Get()
  @ApiCreatedResponse({ type: [RoleResponseDto] })
  @HasPermissions(
    PermissionEnum.RoleGetAll,
    PermissionEnum.RolePermissionGetAll,
    PermissionEnum.PermissionGetAll,
  )
  @ApiOperation({
    summary: Summary.findAllRoles,
    description: Description.findAllRoles,
  })
  async findAll() {
    return this.roleService.findAll();
  }

  @Patch(':uuid')
  @ApiCreatedResponse({ type: RoleResponseDto })
  @HasPermissions(PermissionEnum.RoleUpdate)
  @ApiOperation({
    summary: Summary.updateRole,
    description: Description.updateRole,
  })
  async update(@Param('uuid') uuid: string, @Body() roleDto: RoleUpdateDto) {
    return this.roleService.update(uuid, roleDto);
  }

  @Delete(':uuid')
  @HasPermissions(PermissionEnum.RoleDelete)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: Summary.deleteRole,
    description: Description.deleteRole,
  })
  async delete(@Param('uuid') id: string) {
    return this.roleService.delete(id);
  }
}
