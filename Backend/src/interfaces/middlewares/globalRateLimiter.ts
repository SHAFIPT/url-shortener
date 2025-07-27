// src/interfaces/middlewares/globalRateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../../config/redis';
import { HttpStatusCode } from '../../constants/statusCode';
import { Messages } from '../../constants/messages';

export function createGlobalRateLimiter() {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    }),
    handler: (_req, res) => {
      res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({
        message: Messages.GLOBAL_RATE_LIMIT_EXCEEDED,
      });
    },
  });
}
