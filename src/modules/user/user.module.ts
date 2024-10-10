import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PasswordModule } from '../cache/password/password.module';
import { RoleModule } from '../role/role.module';
import { UserRepository } from './user.repository';
import { CacheModule } from '../cache/cache.module';
import { PrismaService } from '../app/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    PasswordModule,
    CacheModule,
  ],
  exports: [UserService],
})
export class UserModule {}
