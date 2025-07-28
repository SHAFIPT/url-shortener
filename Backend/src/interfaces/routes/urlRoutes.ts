import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { rateLimitMiddleware } from "../middlewares/rateLimitMiddleware";
import { urlController } from "../../config/container";


export const urlRoutes = Router();

urlRoutes.post(
    '/',
    authenticate,
    rateLimitMiddleware,
    urlController.createShortUrl
);

urlRoutes.get("/stats", authenticate, urlController.getDashboardStats); 
urlRoutes.get("/getUrls", authenticate, urlController.getMyUrls); 