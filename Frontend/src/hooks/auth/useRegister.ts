import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { registerApi } from '@/lib/auth/api';
import type { ApiError, RegisterPayload } from '@/types/auth';

type RegisterResponse = { message: string };

export const useRegister = () =>
  useMutation<RegisterResponse, AxiosError<ApiError>, RegisterPayload>({
    mutationFn: registerApi,
  });