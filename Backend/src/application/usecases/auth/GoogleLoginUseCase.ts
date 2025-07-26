// src/application/usecases/auth/GoogleLoginUseCase.ts
import axios from "axios";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { IJwtService } from "../../../domain/interfaces/IJwtService";

export class GoogleLoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwt: IJwtService
  ) {}

  async execute(code: string) {
    // 1. Exchange code for token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = tokenRes.data;

    // 2. Fetch user info
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { name, email } = profileRes.data;
    if (!email) {
      console.error("No email found in Google response");
      throw new UnauthorizedError("Email not found in Google response");
    }

    let user = await this.userRepo.findByEmail(email);

    if (!user) {
      user = await this.userRepo.create({
        name,
        email,
        password: undefined, 
        isVerified: true,
      });
    }
    const accessToken = this.jwt.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.jwt.signRefreshToken({
      sub: user.id,
    });

    await this.userRepo.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
  