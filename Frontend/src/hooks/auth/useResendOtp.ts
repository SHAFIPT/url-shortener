import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { resendOtpApi } from '@/lib/auth/api';
import type { ResendOtpPayload, ApiError, ResendOtpResponse } from '@/types/auth';

export const useResendOtp = () =>
  useMutation<ResendOtpResponse, AxiosError<ApiError>, ResendOtpPayload>({
    mutationFn: resendOtpApi,
  });