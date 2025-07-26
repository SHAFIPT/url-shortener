import axios from '@/lib/http';
import type {
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  DefaultMessage,
  LoginResponse,
} from '@/types/auth';


export const registerApi = async (body: RegisterPayload) => {
  const { data } = await axios.post<DefaultMessage>('/auth/register', body);
  return data;
};

export const loginApi = async (body: LoginPayload) => {
  const { data } = await axios.post<LoginResponse>('/auth/login', body);
  return data;
};

export const logoutApi = async () => {
  const { data } = await axios.post<DefaultMessage>('/auth/logout', {});
  return data;
};

export const verifyOtpApi = async (body: VerifyOtpPayload) => {
  const { data } = await axios.post('/auth/verify-otp', body);
  return data;
};

export const resendOtpApi = async (body: ResendOtpPayload) => {
  const { data } = await axios.post('/auth/resend-otp', body);
  return data;
};

export const forgotPasswordApi = async (body: ForgotPasswordPayload) => {
  const { data } = await axios.post('/auth/forgot-password', body);
  return data;
};

export const resetPasswordApi = async (body: ResetPasswordPayload) => {
  const { data } = await axios.post('/auth/reset-password', body);
  return data;
};

export const googleCodeLoginApi = async (code: string) => {
  const { data } = await axios.post<LoginResponse>('/auth/google', { code }, {
    withCredentials: true
  });
    console.log('This isthe data get in backnd :',data)
    return data;
    
};