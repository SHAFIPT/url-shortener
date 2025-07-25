import { Messages } from "../../../constants/messages";
import { IOtpEmailSender } from "../../../domain/interfaces/IOtpEmailSender";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ResendDTO } from "../../dtos/auth/ResendDTO";

export class ResendOtpUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpEmailSender: IOtpEmailSender
  ) {}

  async execute(dto: ResendDTO) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new Error(Messages.USER_NOT_FOUND);
    if (user.isVerified) throw new Error(Messages.ALREADY_VARIFIED);
    await this.otpEmailSender.sendOtp(user.email, "verify");
    return { message: Messages.OTP_RESENT };
  }
}
