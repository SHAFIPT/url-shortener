import type {
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  DefaultMessage,
  LoginResponse,
} from "@/types/auth";
import axiosInstance from "../http";

export const registerApi = async (body: RegisterPayload) => {
  const { data } = await axiosInstance.post<DefaultMessage>(
    "/auth/register",
    body
  );
  return data;
};

export const loginApi = async (body: LoginPayload) => {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", body);
  return data;
};

export const logoutApi = async () => {
  const { data } = await axiosInstance.post<DefaultMessage>("/auth/logout", {});
  return data;
};

export const verifyOtpApi = async (body: VerifyOtpPayload) => {
  const { data } = await axiosInstance.post("/auth/verify-otp", body);
  return data;
};

export const resendOtpApi = async (body: ResendOtpPayload) => {
  const { data } = await axiosInstance.post("/auth/resend-otp", body);
  return data;
};

export const forgotPasswordApi = async (body: ForgotPasswordPayload) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", body);
  return data;
};

export const resetPasswordApi = async (body: ResetPasswordPayload) => {
  const { data } = await axiosInstance.post("/auth/reset-password", body);
  return data;
};

export const googleCodeLoginApi = async (code: string) => {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/google",
    { code },
    {
      withCredentials: true,
    }
  );
  console.log("This isthe data get in backnd :", data);
  return data;
};
