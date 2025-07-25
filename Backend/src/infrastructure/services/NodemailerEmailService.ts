import { transporter } from '../../config/mail';
import { IEmailService } from '../../domain/interfaces/IEmailService';

export class NodemailerEmailService implements IEmailService {
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}
