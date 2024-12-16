import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);

    if (value) {
      this.logger.log(`Cache HIT for key: ${key}`);
    } else {
      this.logger.log(`Cache MISS for key: ${key}`);
    }
    return value;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    this.logger.log(`Cache SET for key: ${key}, TTL: ${ttl}`);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.warn(`Cache INVALIDATED for key: ${key}`);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.warn(`Cache RESET: All keys have been removed`);
  }
}