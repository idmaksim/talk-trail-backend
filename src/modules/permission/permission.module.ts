import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PrismaService } from '../app/prisma.service';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { UserModule } from '../user/user.module';
import { PermissionRepository } from './permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService, PermissionRepository],
  exports: [PermissionService],
  imports: [forwardRef(() => UserModule), RolePermissionModule],
})
export class PermissionModule {}
