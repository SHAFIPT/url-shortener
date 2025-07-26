import { Messages } from "../../../constants/messages";
import { IOtpService } from "../../../domain/interfaces/IOtpService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { VerifyDTO } from "../../dtos/auth/VerifyDTO";


export class VerifyOtpUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly otpService: IOtpService,
    ) { }
     
    async execute(dto: VerifyDTO) {
        const user = await this.userRepo.findByEmail(dto.email)
        if (!user) throw new Error(Messages.USER_NOT_FOUND)
        const ok = await this.otpService.verify(`otp:verify:${dto.email}`, dto.otp)
        if (!ok) throw new Error(Messages.INVALID_OTP)
        
        user.isVerified = true;
        await this.userRepo.save(user)
        return { message: Messages.EMAIL_VARIFIED };
    }
}