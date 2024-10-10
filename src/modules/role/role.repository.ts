import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    roleDto: Prisma.RoleCreateInput,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.role.create({ data: roleDto });
  }

  findById(
    uuid: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.role.findUnique({ where: { uuid } });
  }

  findByName(
    name: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.role.findUnique({ where: { name } });
  }

  findAll(transactionClient: Prisma.TransactionClient = this.prisma) {
    return transactionClient.role.findMany();
  }

  update(
    uuid: string,
    roleDto: Prisma.RoleUpdateInput,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.role.update({
      where: { uuid },
      data: roleDto,
    });
  }

  delete(
    uuid: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.role.delete({ where: { uuid } });
  }

  createRolePermissions(
    permissions: { roleUuid: string; permissionUuid: string }[],
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.rolePermission.createMany({
      data: permissions,
    });
  }

  deleteRolePermissions(
    roleUuid: string,
    transactionClient: Prisma.TransactionClient = this.prisma,
  ) {
    return transactionClient.rolePermission.deleteMany({
      where: { roleUuid },
    });
  }

  async existsByName(name: string) {
    return !!(await this.findByName(name));
  }

  async existsByUuid(uuid: string) {
    return !!(await this.findById(uuid));
  }
}
