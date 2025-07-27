export interface IRateLimitService {
  checkLimit(userId: string): Promise<{ allowed: boolean; count: number }>;
}