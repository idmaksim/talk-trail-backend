import { PrismaClient } from '@prisma/client';
import { PermissionEnum } from '../../src/common/constants/permission.enum';

export async function seedRole(prisma: PrismaClient) {
  await createUser(prisma);
  await createAdmin(prisma);
}

async function createAdmin(prisma: PrismaClient, role: string = 'admin') {
  await prisma.$transaction(async (prisma) => {
    const createdRole = await prisma.role.create({
      data: { name: role },
    });
    const permissions = await prisma.permission.findMany();
    const rolePermissions = permissions.map((permission) => ({
      roleUuid: createdRole.uuid,
      permissionUuid: permission.uuid,
    }));
    await prisma.rolePermission.createMany({
      data: rolePermissions,
    });
  });
}

async function createUser(prisma: PrismaClient) {
  await prisma.$transaction(async (prisma) => {
    const createdRole = await prisma.role.create({
      data: { name: 'user' },
    });
    const userPermissions = [];
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: userPermissions },
      },
    });
    const rolePermissions = permissions.map((permission) => ({
      roleUuid: createdRole.uuid,
      permissionUuid: permission.uuid,
    }));
    await prisma.rolePermission.createMany({
      data: rolePermissions,
    });
  });
}
