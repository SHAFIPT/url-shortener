import { IUrlCacheService } from '../../domain/interfaces/IUrlCacheService';
import { redis } from '../../config/redis';

export class RedisUrlCacheService implements IUrlCacheService {
  async setShortUrl(shortCode: string, longUrl: string, ttlSeconds: number): Promise<void> {
    await redis.set(`short:${shortCode}`, longUrl, { EX: ttlSeconds });
  }

  async getLongUrl(shortCode: string): Promise<string | null> {
    return await redis.get(`short:${shortCode}`);
  }
}
