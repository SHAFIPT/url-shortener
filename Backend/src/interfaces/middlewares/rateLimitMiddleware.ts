import { rateLimitService } from "../../config/container";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/express";
import { HttpStatusCode } from "../../constants/statusCode";
import { Messages } from "../../constants/messages";
import { RateLimitExceededError } from "../../application/errors/RateLimitExceededError";
export const rateLimitMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: Messages.UNAUTHORIZED_USER,
    });
  }

  try {
    const { allowed } = await rateLimitService.checkLimit(userId);
    if (!allowed) {
      throw new RateLimitExceededError(Messages.DAILY_LIMIT_REACHED);
    }
    next();
  } catch (err) {
    next(err); 
  }
};
