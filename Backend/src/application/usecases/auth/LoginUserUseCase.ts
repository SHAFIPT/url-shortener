import { Messages } from "../../../constants/messages";
import { IJwtService } from "../../../domain/interfaces/IJwtService";
import { IPasswordHasher } from "../../../domain/interfaces/IPasswordHasher";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { LoginDTO } from "../../dtos/auth/LoginDTO";

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hasher: IPasswordHasher,
    private readonly jwt: IJwtService
  ) {}
  async execute(dto: LoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { name: string; email: string };
  }> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new Error(Messages.USER_NOT_FOUND);
    if (!user.isVerified) throw new Error(Messages.EMAIL_NOT_VARIFIED);

    const ok = await this.hasher.compare(dto.password, user.password);
    if (!ok) throw new Error(Messages.INCORRECT_PASSWORD);

    const accessToken = this.jwt.signAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = this.jwt.signRefreshToken({ sub: user.id });
    await this.userRepo.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    };
  }
}
