export interface IUrlCacheService {
  setShortUrl(shortCode: string, longUrl: string, ttlSeconds: number): Promise<void>;
  getLongUrl(shortCode: string): Promise<string | null>;
}