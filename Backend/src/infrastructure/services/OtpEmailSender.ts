import { IOtpService } from '../../domain/interfaces/IOtpService';
import { IEmailService } from '../../domain/interfaces/IEmailService';
import { IOtpEmailSender } from '../../domain/interfaces/IOtpEmailSender';

export class OtpEmailSender implements IOtpEmailSender {
  constructor(
    private otpService: IOtpService,
    private mailer: IEmailService
  ) {}

  async sendOtp(email: string, type: 'verify' | 'reset'): Promise<void> {
    const otpKey = `otp:${type}:${email}`;
    const otp = await this.otpService.generateAndStore(otpKey, 10 * 60);

    const subject = type === 'verify' ? 'Verify your account' : 'Reset your password';
    const body = `<p>Your OTP is <b>${otp}</b>. Expires in 10 minutes.</p>`;

    await this.mailer.sendMail(email, subject, body);
  }
}
