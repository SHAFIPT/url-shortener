export interface IOtpEmailSender {
  sendOtp(email: string, type: 'verify' | 'reset'): Promise<void>;
}