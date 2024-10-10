import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService');

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async get(key: string) {
    const cachedData = await this.cache.get(key);
    this.logger.log(`Получены данные по ключу ${key} из кэша`);
    return cachedData;
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      await this.cache.set(key, value, ttl);
    } else {
      await this.cache.set(key, value);
    }
    this.logger.log(`Данные ${key} сохранены в кэш`);
  }

  async existsByKey(key: string) {
    const cachedData = await this.cache.get(key);
    const exists = cachedData !== null;
    this.logger.log(`Проверка на наличие данных ${key} в кэше: ${exists}`);
    return exists;
  }

  async delete(key: string) {
    await this.cache.del(key);
    this.logger.log(`Данные ${key} удалены из кэша`);
  }

  async reset() {
    await this.cache.reset();
    this.logger.log('Кэш сброшен');
  }
}
