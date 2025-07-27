// hooks/auth/useGoogleCodeLogin.ts
import { useMutation } from '@tanstack/react-query';
import { googleCodeLoginApi } from '@/lib/auth/api';
import { setAccessToken } from '@/utils/tokenUtils';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slice/userSlice';
import type { AxiosError } from 'axios';
import type { ApiError, LoginResponse } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { useShortenUrl } from '../url/useShortenUrl';
import { popPendingUrl } from '@/utils/pendingUrl';
import toast from 'react-hot-toast';

export const useGoogleCodeLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: shortenUrl } = useShortenUrl();

  return useMutation<LoginResponse, AxiosError<ApiError>, { code: string }>({
    mutationFn: ({ code }) => googleCodeLoginApi(code),
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken);
      dispatch(loginSuccess({ user }));

      const pendingUrl = popPendingUrl();
      if (pendingUrl) {
        shortenUrl(
          { longUrl: pendingUrl },
          {
            onSuccess: (data) => {
              toast.success('Short URL created from pending URL!');
              navigate('/dashboard', { state: { justCreatedId: data.id } });
            },
            onError: () => {
              toast.error('Failed to shorten your pending URL.');
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
