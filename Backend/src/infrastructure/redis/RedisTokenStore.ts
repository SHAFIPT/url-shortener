import { ITokenStore } from "../../domain/interfaces/ITokenStore";
import { redis } from "../../config/redis";

export class RedisTokenStore implements ITokenStore {
  async save(key: string, value: string, ttlSeconds: number): Promise<void> {
    await redis.set(key, value, {
      EX: ttlSeconds,
    });
  }

  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}
