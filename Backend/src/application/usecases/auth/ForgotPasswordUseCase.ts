import { Messages } from "../../../constants/messages";
import { IOtpEmailSender } from "../../../domain/interfaces/IOtpEmailSender";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ForgotDTO } from "../../dtos/auth/ForgotDTO";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpEmailSender: IOtpEmailSender
  ) {}

  async execute(dto: ForgotDTO) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) return { message: Messages.USER_NOT_FOUND };
    await this.otpEmailSender.sendOtp(user.email, "reset");
    return { message: Messages.OTP_SENT_IF_EMAIL_EXISTS };
  }
}
