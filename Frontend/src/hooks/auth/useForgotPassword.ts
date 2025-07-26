import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { forgotPasswordApi } from '@/lib/auth/api';
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ApiError,
} from '@/types/auth';

export const useForgotPassword = () =>
  useMutation<ForgotPasswordResponse, AxiosError<ApiError>, ForgotPasswordPayload>({
    mutationFn: forgotPasswordApi,
  });