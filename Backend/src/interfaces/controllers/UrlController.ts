import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/express";
import { HttpStatusCode } from "../../constants/statusCode";
import { CreateShortUrlUseCase } from "../../application/usecases/url/CreateShortUrlUseCase";
import { Messages } from "../../constants/messages";
import { GetOriginalUrlUseCase } from "../../application/usecases/url/GetOriginalUrlUseCase";
import { createShortUrlSchema } from "../validators/urlValidator";
import { GetDashboardStatsUseCase } from "../../application/usecases/url/GetDashboardStatsUseCase";
import { GetMyUrlsUseCase } from "../../application/usecases/url/GetMyUrlsUseCase";

export class UrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase,
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly getMyUrlsUseCase: GetMyUrlsUseCase
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
  public getDashboardStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: Messages.UNAUTHORIZED_USER });
      }

      const stats = await this.getDashboardStatsUseCase.execute({ userId });
      return res.status(HttpStatusCode.OK).json(stats);
    } catch (err) {
      next(err);
    }
  };

  public getMyUrls = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: Messages.UNAUTHORIZED_USER,
        });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
        search = "",
      } = req.query;

      const result = await this.getMyUrlsUseCase.execute({
        userId,
        page: Number(page),
        limit: Number(limit),
        sortBy: String(sortBy),
        order: String(order) as "asc" | "desc",
        search: String(search),
      });

      res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  };
}
