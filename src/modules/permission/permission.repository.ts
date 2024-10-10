import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(uuid: string) {
    return this.prisma.permission.findUnique({ where: { uuid } });
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    const result = await this.prisma.permission.findUnique({
      where: { uuid },
      select: { uuid: true },
    });
    return result !== null;
  }

  async existsMany(uuids: string[]): Promise<boolean> {
    const permissionExistsResults = await this.prisma.permission.findMany({
      where: { uuid: { in: uuids } },
      select: { uuid: true },
    });
    return permissionExistsResults.length === uuids.length;
  }
}
