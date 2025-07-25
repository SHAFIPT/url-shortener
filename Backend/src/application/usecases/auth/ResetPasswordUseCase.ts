import { Messages } from "../../../constants/messages";
import { IOtpService } from "../../../domain/interfaces/IOtpService";
import { IPasswordHasher } from "../../../domain/interfaces/IPasswordHasher";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ResetDTO } from "../../dtos/auth/ResetDTO";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpService: IOtpService,
    private readonly hasher: IPasswordHasher
  ) {}
  async execute(dto: ResetDTO) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new Error(Messages.USER_NOT_FOUND);
    const ok = await this.otpService.verify(`otp:verify:${dto.email}`, dto.otp);
    if (!ok) throw new Error(Messages.INVALID_OTP);
    user.password = await this.hasher.hash(dto.newPassword);
    await this.userRepo.save(user);
    return { message: Messages.PASSWORD_UPDATED };
  }
}
