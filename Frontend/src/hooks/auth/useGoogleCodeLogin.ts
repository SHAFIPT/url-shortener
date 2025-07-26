// hooks/auth/useGoogleCodeLogin.ts
import { useMutation } from '@tanstack/react-query';
import { googleCodeLoginApi } from '@/lib/auth/api';
import { setAccessToken } from '@/utils/tokenUtils';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slice/userSlice';
import type { AxiosError } from 'axios';
import type { ApiError, LoginResponse } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

export const useGoogleCodeLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<ApiError>, { code: string }>({
    mutationFn: ({ code }) => googleCodeLoginApi(code),
      onSuccess: ({ accessToken, user }) => {
        console.log('This is the access token : ',accessToken)
        console.log('This is the user ............. : ',user)
      setAccessToken(accessToken);  
      dispatch(loginSuccess({ user })); 
      navigate('/');
    },
  });
};
