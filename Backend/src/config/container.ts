import { ForgotPasswordUseCase } from "../application/usecases/auth/ForgotPasswordUseCase";
import { LoginUserUseCase } from "../application/usecases/auth/LoginUserUseCase";
import { LogoutUseCase } from "../application/usecases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../application/usecases/auth/RefreshTokenUseCase";
import { RegisterUserUseCase } from "../application/usecases/auth/RegisterUserUseCase";
import { ResendOtpUseCase } from "../application/usecases/auth/ResendOtpUseCase";
import { ResetPasswordUseCase } from "../application/usecases/auth/ResetPasswordUseCase";
import { VerifyOtpUseCase } from "../application/usecases/auth/VerifyOtpUseCase";
import { UserRepository } from "../infrastructure/db/repositories/UserRepository";
import { RedisOtpService } from "../infrastructure/redis/OtpService";
import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher";
import { JwtService } from "../infrastructure/services/JwtService";
import { NodemailerEmailService } from "../infrastructure/services/NodemailerEmailService";
import { OtpEmailSender } from "../infrastructure/services/OtpEmailSender";
import { AuthController } from "../interfaces/controllers/authController";


const userRepo = new UserRepository();
const hasher = new BcryptPasswordHasher();
const jwt = new JwtService();
const otpService = new RedisOtpService();
const mailer = new NodemailerEmailService();
const otpEmailSender = new OtpEmailSender(otpService, mailer);

const registerUserUseCase = new RegisterUserUseCase(userRepo, hasher, otpEmailSender);
const loginUserUseCase = new LoginUserUseCase(userRepo, hasher, jwt);
const refreshTokenUseCase = new RefreshTokenUseCase(jwt, userRepo);
const logoutUseCase = new LogoutUseCase(userRepo);
const resendOtpUseCase = new ResendOtpUseCase(userRepo, otpEmailSender);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepo, otpService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, otpEmailSender);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, otpService, hasher);

// Instantiate controller
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  resendOtpUseCase,
  verifyOtpUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase
);