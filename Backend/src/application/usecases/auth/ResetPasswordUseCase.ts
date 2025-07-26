import { Messages } from "../../../constants/messages";
import { IJwtService } from "../../../domain/interfaces/IJwtService";
import { IPasswordHasher } from "../../../domain/interfaces/IPasswordHasher";
import { ITokenStore } from "../../../domain/interfaces/ITokenStore";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ResetWithTokenDTO } from "../../dtos/auth/ResetDTO";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly hasher: IPasswordHasher,
    private readonly tokenStore?: ITokenStore
  ) {}

  async execute(dto: ResetWithTokenDTO) {
    type Payload = { sub: string; email: string; jti: string };
    let payload: Payload;

    try {
      payload = this.jwtService.verifyPasswordResetToken<Payload>(dto.token);
    } catch {
      throw new Error(Messages.INVALID_OR_EXPIRED_TOKEN);
    }

    if (this.tokenStore) {
      const key = `pr:${payload.jti}`;
      const stillValid = await this.tokenStore.get(key);
      if (!stillValid) throw new Error(Messages.INVALID_OR_EXPIRED_TOKEN);
    }

    const user = await this.userRepo.findByEmail(payload.email);
    if (!user) throw new Error(Messages.USER_NOT_FOUND);

    user.password = await this.hasher.hash(dto.newPassword);
    await this.userRepo.save(user);

    if (this.tokenStore) {
      await this.tokenStore.del(`pr:${payload.jti}`);
    }

    return { message: Messages.PASSWORD_UPDATED };
  }
}
