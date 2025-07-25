// src/infrastructure/services/JwtService.ts
import jwt from "jsonwebtoken";
import { IJwtService } from "../../domain/interfaces/IJwtService";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secure_secret_key";

export class JwtService implements IJwtService {
  signAccessToken(payload: { sub: string; email?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  }

  signRefreshToken(payload: { sub: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }

  verifyRefreshToken<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }
}
