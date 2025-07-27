import { IShortCodeGenerator } from "../../domain/interfaces/IShortCodeGenerator";
import { redis } from "../../config/redis"; // To store counter globally

export class ShortCodeGenerator implements IShortCodeGenerator {
  constructor(private readonly defaultLength = 7) {}

  private base62Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  private encodeBase62(num: number): string {
    let result = '';
    const base = this.base62Chars.length;
    while (num > 0) {
      result = this.base62Chars[num % base] + result;
      num = Math.floor(num / base);
    }
    return result.padStart(this.defaultLength, '0'); 
  }

  async generate(): Promise<string> {
    const counter = await redis.incr('shortCode:counter'); 
    return this.encodeBase62(counter);
  }
}
