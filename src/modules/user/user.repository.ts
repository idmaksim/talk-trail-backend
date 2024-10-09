import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async findOneByUuid(uuid: string) {
    return this.prisma.user.findFirst({
      where: { uuid },
      include: {
        role: true,
      },
    });
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { uuid },
      select: { uuid: true },
    });
    return !!result;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    return !!result;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: { username },
      select: { username: true },
    });
    return !!result;
  }

  async create(userDto: any, hashedPassword: string, userRoleUuid: string) {
    const user = await this.prisma.user.create({
      data: {
        ...userDto,
        password: hashedPassword,
        role: { connect: { uuid: userRoleUuid } },
      },
      include: { role: true },
    });
    return { uuid: user.uuid, email: user.email };
  }
}
