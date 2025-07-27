import { IRateLimitService } from '../../domain/interfaces/IRateLimitService';
import { redis } from '../../config/redis';

export class RedisRateLimitService implements IRateLimitService {
  private DAILY_LIMIT = 100;

  async checkLimit(userId: string): Promise<{ allowed: boolean; count: number }> {
    const today = new Date().toISOString().split('T')[0];
    const key = `limit:${userId}:${today}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        const secondsLeftToday =
          Math.floor(new Date().setUTCHours(24, 0, 0, 0) / 1000) -
          Math.floor(Date.now() / 1000);
        await redis.expire(key, secondsLeftToday);
      }
      return {
        allowed: current <= this.DAILY_LIMIT,
        count: current,
      };
    } catch (err) {
      console.error("Redis rate limit error:", err);
      return { allowed: false, count: 0 };
    }
  }
}
