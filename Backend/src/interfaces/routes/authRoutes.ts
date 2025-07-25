import { Router } from 'express';
import { authController } from '../../config/container';
import { authenticate } from '../middlewares/authMiddleware';

export const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/verify-otp', authController.verifyOtp);
authRoutes.post('/resend-otp', authController.resendOtp);
authRoutes.post('/login', authController.login);
authRoutes.post('/refresh', authController.refreshToken);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);
authRoutes.post('/logout', authenticate, authController.logout);
  