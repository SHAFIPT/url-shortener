import { IMailer } from "../../domain/interfaces/IMailer";
import { transporter } from "../../config/mail";

export class NodemailerMailerService implements IMailer {
  async sendPasswordReset(email: string, resetLink: string): Promise<void> {
    const html = `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html,
    });
  }
}