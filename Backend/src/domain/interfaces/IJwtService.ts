export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtService {
  signAccessToken(payload: object): string;
  signRefreshToken(payload: object): string;
  verifyAccessToken<T = any>(token: string): T;
  verifyRefreshToken<T = any>(token: string): T;
  signPasswordResetToken(payload: { sub: string; email: string; jti: string }): string;
  verifyPasswordResetToken<T = any>(token: string): T;
}


export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}