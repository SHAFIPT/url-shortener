import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/express";
import { HttpStatusCode } from "../../constants/statusCode";
import { CreateShortUrlUseCase } from "../../application/usecases/url/CreateShortUrlUseCase";
import { Messages } from "../../constants/messages";
import { GetOriginalUrlUseCase } from "../../application/usecases/url/GetOriginalUrlUseCase";
import { createShortUrlSchema } from "../validators/urlValidator";

export class UrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase
  ) {}

  public createShortUrl = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: Messages.UNAUTHORIZED_USER });
        return;
      }

      const parsed = createShortUrlSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: Messages.INVALID_INPUT,
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { longUrl } = parsed.data;
      const shortUrl = await this.createShortUrlUseCase.execute({
        longUrl,
        userId,
      });
      res.status(HttpStatusCode.CREATED).json({ shortUrl });
    } catch (error) {
      next(error);
    }
  };
  public redirectToLongUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code } = req.params;
      const longUrl = await this.getOriginalUrlUseCase.execute({
        shortCode: code,
      });

      return res.redirect(longUrl);
    } catch (error) {
      next(error);
    }
  };
}
