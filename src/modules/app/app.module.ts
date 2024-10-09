import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import config from 'src/config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientOptions } from 'redis';

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
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
