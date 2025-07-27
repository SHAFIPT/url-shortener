import { ForgotPasswordUseCase } from "../application/usecases/auth/ForgotPasswordUseCase";
import { GoogleLoginUseCase } from "../application/usecases/auth/GoogleLoginUseCase";
import { LoginUserUseCase } from "../application/usecases/auth/LoginUserUseCase";
import { LogoutUseCase } from "../application/usecases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "../application/usecases/auth/RefreshTokenUseCase";
import { RegisterUserUseCase } from "../application/usecases/auth/RegisterUserUseCase";
import { ResendOtpUseCase } from "../application/usecases/auth/ResendOtpUseCase";
import { ResetPasswordUseCase } from "../application/usecases/auth/ResetPasswordUseCase";
import { VerifyOtpUseCase } from "../application/usecases/auth/VerifyOtpUseCase";
import { CreateShortUrlUseCase } from "../application/usecases/url/CreateShortUrlUseCase";
import { GetOriginalUrlUseCase } from "../application/usecases/url/GetOriginalUrlUseCase";
import { UrlRepoMongo } from "../infrastructure/db/repositories/UrlRepoMongo";
import { UserRepository } from "../infrastructure/db/repositories/UserRepository";
import { RedisOtpService } from "../infrastructure/redis/OtpService";
import { RedisRateLimitService } from "../infrastructure/redis/RedisRateLimitService";
import { RedisTokenStore } from "../infrastructure/redis/RedisTokenStore";
import { RedisUrlCacheService } from "../infrastructure/redis/RedisUrlCacheService";
import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher";
import { JwtService } from "../infrastructure/services/JwtService";
import { NodemailerMailerService } from "../infrastructure/services/MailerService";
import { NodemailerEmailService } from "../infrastructure/services/NodemailerEmailService";
import { OtpEmailSender } from "../infrastructure/services/OtpEmailSender";
import { ShortCodeGenerator } from "../infrastructure/services/ShortCodeGenerator";
import { AuthController } from "../interfaces/controllers/authController";
import { UrlController } from "../interfaces/controllers/UrlController";

//auth
const userRepo = new UserRepository();
const hasher = new BcryptPasswordHasher();
const jwt = new JwtService();
const otpService = new RedisOtpService();
const tokenService = new RedisTokenStore();
const otpMailer = new NodemailerEmailService();
const tokenMailer = new NodemailerMailerService(); 
const otpEmailSender = new OtpEmailSender(otpService, otpMailer);

const registerUserUseCase = new RegisterUserUseCase(userRepo, hasher, otpEmailSender);
const loginUserUseCase = new LoginUserUseCase(userRepo, hasher, jwt);
const refreshTokenUseCase = new RefreshTokenUseCase(jwt, userRepo);
const logoutUseCase = new LogoutUseCase(userRepo);
const resendOtpUseCase = new ResendOtpUseCase(userRepo, otpEmailSender);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepo, otpService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, jwt, tokenMailer ,tokenService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, jwt, hasher, tokenService);
const googleLoginUseCase = new GoogleLoginUseCase(userRepo, jwt);

// Instantiate controller
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  resendOtpUseCase,
  verifyOtpUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  googleLoginUseCase,
  jwt
);

//url
const urlRepo = new UrlRepoMongo()
const shortCodeGen = new ShortCodeGenerator()
const urlCacheService = new RedisUrlCacheService();
export const rateLimitService = new RedisRateLimitService();

const createShortUrlUseCase = new CreateShortUrlUseCase(urlRepo, shortCodeGen, urlCacheService)
const getOriginalUrlUseCase = new GetOriginalUrlUseCase(urlRepo, urlCacheService)

export const urlController = new UrlController(
  createShortUrlUseCase,
  getOriginalUrlUseCase
)

