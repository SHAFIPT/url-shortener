import { type ApiError, type LoginPayload, type LoginResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { loginApi } from '@/lib/auth/api';
import { loginSuccess } from '@/redux/slice/userSlice';
import { setAccessToken } from '@/utils/tokenUtils';

import { popPendingUrl } from '@/utils/pendingUrl';
import toast from 'react-hot-toast';
import { useShortenUrl } from '../url/useShortenUrl';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: shortenUrl } = useShortenUrl();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken); 
      dispatch(loginSuccess({ user }));

      const pendingUrl = popPendingUrl();
      if (pendingUrl) {
        shortenUrl(
          { longUrl: pendingUrl },
          {
            onSuccess: (data) => {
              toast.success('Short URL created from pending login!');
              navigate('/dashboard', { state: { justCreatedId: data.id } });
            },
            onError: () => {
              toast.error('Failed to shorten your saved URL.');
              navigate('/dashboard');
            },
          }
        );
      } else {
        navigate('/');
      }
    },
  });
};
