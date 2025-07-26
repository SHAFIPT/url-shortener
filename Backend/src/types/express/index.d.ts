// types/express.d.ts
import { Request } from "express";

export interface AuthPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtDecodedPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}
