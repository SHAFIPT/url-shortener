import { type ApiError, type LoginPayload, type LoginResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import type { AxiosError } from 'axios';

import { loginApi } from '@/lib/auth/api';
import { loginSuccess } from '@/redux/slice/userSlice';
import { setAccessToken } from '@/utils/tokenUtils';

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken); 
      dispatch(loginSuccess({ user })); 
    },
  });
};