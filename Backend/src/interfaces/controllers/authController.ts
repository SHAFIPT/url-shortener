import { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "../../application/dtos/auth/RegisterDTO";
import { LoginUserUseCase } from "../../application/usecases/auth/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/auth/RegisterUserUseCase";
import { RefreshTokenUseCase } from "../../application/usecases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "../../application/usecases/auth/LogoutUseCase";
import { ResendOtpUseCase } from "../../application/usecases/auth/ResendOtpUseCase";
import { VerifyOtpUseCase } from "../../application/usecases/auth/VerifyOtpUseCase";
import { ForgotPasswordUseCase } from "../../application/usecases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/usecases/auth/ResetPasswordUseCase";
import { VerifyDTO } from "../../application/dtos/auth/VerifyDTO";
import { ResendDTO } from "../../application/dtos/auth/ResendDTO";
import { ForgotDTO } from "../../application/dtos/auth/ForgotDTO";
import { ResetWithTokenDTO } from "../../application/dtos/auth/ResetDTO";
import { AuthenticatedRequest } from "../../types/express";
import { HttpStatusCode } from "../../constants/statusCode";
import { Messages } from "../../constants/messages";
import { GoogleLoginUseCase } from "../../application/usecases/auth/GoogleLoginUseCase";
import { IJwtService } from "../../domain/interfaces/IJwtService";

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private readonly jwt: IJwtService
  ) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: RegisterDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const result = await this.registerUserUseCase.execute(dto);
      res
        .status(HttpStatusCode.CREATED)
        .json({ message: Messages.REGISTER_SUCCESS, result });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, user } =
        await this.loginUserUseCase.execute(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatusCode.OK).json({
        message: Messages.LOGIN_SUCCESS,
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
 
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: Messages.MISSING_REFRESH_TOKEN });
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.refreshTokenUseCase.execute(refreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code } = req.body;
      const { user, accessToken, refreshToken } =
        await this.googleLoginUseCase.execute(code);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({ accessToken, user });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "No refresh token found" });
      }

      const decoded = this.jwt.verifyRefreshToken(token);
      const userId = decoded.sub;

      await this.logoutUseCase.execute(userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res
        .status(HttpStatusCode.OK)
        .json({ message: Messages.LOGOUT_SUCCESS });
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Invalid or expired refresh token" });
    }
  };

  public verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: VerifyDTO = {
        email: req.body.email,
        otp: req.body.otp,
      };
      const result = await this.verifyOtpUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  public resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: ResendDTO = {
        email: req.body.email,
      };
      const result = await this.resendOtpUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: ForgotDTO = {
        email: req.body.email,
      };
      const result = await this.forgotPasswordUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: ResetWithTokenDTO = {
        token: req.body.token,
        newPassword: req.body.newPassword,
      };
      const result = await this.resetPasswordUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
