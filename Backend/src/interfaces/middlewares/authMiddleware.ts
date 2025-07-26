import { RequestHandler, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthPayload, JwtDecodedPayload } from '../../types/express';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {    
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = authHeader.split(' ')[1];

  try {
   const decoded = jwt.verify(token, JWT_SECRET) as JwtDecodedPayload;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    next();
  } catch (err) {
    console.log('This is the errror',err)
    res.status(403).json({ message: 'Token is invalid or expired' });
    return;
  }
};
