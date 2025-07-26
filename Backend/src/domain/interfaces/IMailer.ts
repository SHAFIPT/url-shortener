export interface IMailer {
  sendPasswordReset(email: string, resetLink: string): Promise<void>;
}