import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { resetPasswordApi } from '@/lib/auth/api';
import type {
  ResetPasswordPayload,
  ResetPasswordResponse,
  ApiError,
} from '@/types/auth';

export const useResetPassword = () =>
  useMutation<ResetPasswordResponse, AxiosError<ApiError>, ResetPasswordPayload>({
    mutationFn: resetPasswordApi,
  });