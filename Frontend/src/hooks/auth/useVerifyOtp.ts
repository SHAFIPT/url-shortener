import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { verifyOtpApi } from '@/lib/auth/api';
import type { VerifyOtpPayload, ApiError, VerifyOtpResponse } from '@/types/auth';

export const useVerifyOtp = () =>
  useMutation<VerifyOtpResponse, AxiosError<ApiError>, VerifyOtpPayload>({
    mutationFn: verifyOtpApi,
  });