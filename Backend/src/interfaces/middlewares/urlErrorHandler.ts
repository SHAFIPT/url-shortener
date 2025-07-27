import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../constants/statusCode';
import { NotFoundError } from '../../application/errors/NotFoundError';
import { GoneError } from '../../application/errors/GoneError';
import { RateLimitExceededError } from '../../application/errors/RateLimitExceededError';

export function urlErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[URL-ERROR] ${err.name || 'Error'}: ${err.message}`);

  if (err instanceof NotFoundError) {
    return res.status(HttpStatusCode.NOT_FOUND).json({ message: err.message });
  }

  if (err instanceof GoneError) {
    return res.status(HttpStatusCode.GONE).json({ message: err.message });
  }

  if (err instanceof RateLimitExceededError) {
    return res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({ message: err.message });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    details: err.message || 'Unexpected error occurred',
  });
}
