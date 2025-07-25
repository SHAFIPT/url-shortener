export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtService {
  signAccessToken(payload: object): string;
  signRefreshToken(payload: object): string;
  verifyAccessToken<T = any>(token: string): T;
  verifyRefreshToken<T = any>(token: string): T;
}