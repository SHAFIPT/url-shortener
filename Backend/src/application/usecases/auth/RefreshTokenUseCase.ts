import { IJwtService, Tokens } from "../../../domain/interfaces/IJwtService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class RefreshTokenUseCase {
  constructor(
    private readonly jwt: IJwtService,
    private readonly userRepo: IUserRepository
  ) {}
  async execute(refreshToken: string): Promise<Tokens> {
    const payload = this.jwt.verifyRefreshToken<{ sub: string }>(refreshToken);
    const user = await this.userRepo.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken)
      throw new Error("Invalid refresh token");

    const accessToken = this.jwt.signAccessToken({
      sub: user.id,
      email: user.email,
    });
    const newRefreshToken = this.jwt.signRefreshToken({ sub: user.id });

    await this.userRepo.setRefreshToken(user.id, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
