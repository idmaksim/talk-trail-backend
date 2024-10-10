import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPermissionsByRoleUuid(roleUuid: string) {
    return this.prisma.rolePermission.findMany({
      where: { roleUuid },
      select: { permission: true },
    });
  }
}
