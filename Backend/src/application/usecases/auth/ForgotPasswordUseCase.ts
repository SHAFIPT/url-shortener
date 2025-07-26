import { Messages } from "../../../constants/messages";
import { IJwtService } from "../../../domain/interfaces/IJwtService";
import { IMailer } from "../../../domain/interfaces/IMailer";
import { ITokenStore } from "../../../domain/interfaces/ITokenStore";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ForgotDTO } from "../../dtos/auth/ForgotDTO";
import { v4 as uuid } from 'uuid';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwt: IJwtService,
    private readonly mailer: IMailer,
    private readonly tokenStore?: ITokenStore 
  ) {}

  async execute(dto: ForgotDTO) {
    const user = await this.userRepo.findByEmail(dto.email);

    // Don't reveal existence of user
    if (!user) return { message: Messages.OTP_SENT_IF_EMAIL_EXISTS };

    const jti = uuid();
    const token = this.jwt.signPasswordResetToken({
      sub: user.id,
      email: user.email,
      jti,
    });

    if (this.tokenStore) {
      const key = `pr:${jti}`;
      await this.tokenStore.save(key, "valid", 15 * 60); 
    }

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    await this.mailer.sendPasswordReset(user.email, resetLink);

    return { message: Messages.OTP_SENT_IF_EMAIL_EXISTS };
  }
}
