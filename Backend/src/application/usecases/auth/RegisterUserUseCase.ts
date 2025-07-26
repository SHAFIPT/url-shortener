import { Messages } from "../../../constants/messages";
import { IOtpEmailSender } from "../../../domain/interfaces/IOtpEmailSender";
import { IPasswordHasher } from "../../../domain/interfaces/IPasswordHasher";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { RegisterDTO } from "../../dtos/auth/RegisterDTO";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hasher: IPasswordHasher,
    private readonly otpEmailSender: IOtpEmailSender
  ) {}

  async execute(dto: RegisterDTO): Promise<{ message: string }> {
    const existing = await this.userRepo.findByEmail(dto.email);
     if (existing) {
      if (!existing.isVerified) {
        await this.otpEmailSender.sendOtp(existing.email, 'verify');
        return { message: Messages.NOT_VERIFIED_OTP_RESENT };
      }
      throw new Error(Messages.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await this.hasher.hash(dto.password);
    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      isVerified: false,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await this.otpEmailSender.sendOtp(user.email, 'verify');
    return { message: Messages.REGISTED_OTP_SEND };
  }
}
