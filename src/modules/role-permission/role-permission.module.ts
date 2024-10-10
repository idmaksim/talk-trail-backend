import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { PrismaService } from '../app/prisma.service';
import { UserModule } from '../user/user.module';
import { RolePermissionRepository } from './role-permission.repository';

@Module({
  providers: [RolePermissionService, PrismaService, RolePermissionRepository],
  imports: [forwardRef(() => UserModule)],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
