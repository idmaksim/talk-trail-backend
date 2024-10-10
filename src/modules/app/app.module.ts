import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import config from 'src/config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientOptions } from 'redis';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver } from 'nestjs-i18n';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get('REDIS_URL'),
          port: 6379,
          ttl: configService.get('REDIS_TTL'),
          max: configService.get('REDIS_MAX'),
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
          db: 0,
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      fallbacks: {
        'ru-*': 'ru',
      },
      loaderOptions: {
        path: `./dist/i18n/`,
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    AuthModule,
    UserModule,
    RolePermissionModule,
    RoleModule,
    PermissionModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
