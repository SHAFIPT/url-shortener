export interface IOtpService {
  generateAndStore(key: string, ttlSeconds: number): Promise<string>;
  verify(key: string, otp: string): Promise<boolean>;
  resend(key: string, ttlSeconds: number): Promise<string>;
}