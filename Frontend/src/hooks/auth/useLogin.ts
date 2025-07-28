import {
  type ApiError,
  type LoginPayload,
  type LoginResponse,
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { loginApi } from "@/lib/auth/api";
import { loginSuccess } from "@/redux/slice/userSlice";
import { setAccessToken } from "@/utils/tokenUtils";

import { popPendingUrl } from "@/utils/pendingUrl";
import toast from "react-hot-toast";
import { useShortenUrl } from "../url/useShortenUrl";
export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync: shortenUrlAsync } = useShortenUrl();

  return useMutation<LoginResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: async ({ accessToken, user }) => {
      setAccessToken(accessToken);
      dispatch(loginSuccess({ user }));

      const pendingUrl = popPendingUrl();
      
      if (pendingUrl) {
        
        try {
          const data = await shortenUrlAsync({ longUrl: pendingUrl });
          
          const navigationState = {
            fromPendingUrl: true,
            shortenedUrl: data.shortUrl,
            originalUrl: pendingUrl,
          };
          
          toast.success("Short URL created from pending login!");
          
          navigate("/", {
            state: navigationState,
            replace: true,
          });
          
        } catch (error) {
          console.log('❌ shortenUrl failed:', error);
          toast.error("Failed to shorten your saved URL.");
          navigate("/", { replace: true });
        }
      } else {
        console.log('No pending URL, navigating normally');
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};