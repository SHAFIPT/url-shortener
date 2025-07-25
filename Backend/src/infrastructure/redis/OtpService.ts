import { IOtpService } from '../../domain/interfaces/IOtpService';
import { redis } from '../../config/redis';

function randomOtp(len = 6) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
}

export class RedisOtpService implements IOtpService {
  async generateAndStore(key: string, ttlSeconds: number): Promise<string> {
    const otp = randomOtp();
    await redis.set(key, otp, { EX: ttlSeconds });
    return otp;
  }
  async verify(key: string, otp: string): Promise<boolean> {
    const val = await redis.get(key);
    if (!val || val !== otp) return false;
    await redis.del(key);
    return true;
  }
  async resend(key: string, ttlSeconds: number): Promise<string> {
    const otp = randomOtp();
    await redis.set(key, otp, { EX: ttlSeconds });
    return otp;
  }
}