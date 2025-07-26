export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type RegisterPayload = { name: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };
export type VerifyOtpPayload = { email: string; otp: string };
export type ResendOtpPayload = { email: string };
export type ForgotPasswordPayload = { email: string };
export type ResetPasswordPayload = { token: string; newPassword: string };
export type LoginResponse = { message: string; user: User; accessToken: string };
export type RefreshResponse = { message: string; accessToken: string; user?: User };
export type DefaultMessage = { message: string };
export type VerifyOtpResponse = { message: string };
export type ResendOtpResponse = { message: string };
export type ForgotPasswordResponse = { message: string };
export type ResetPasswordResponse = { message: string };


export type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};