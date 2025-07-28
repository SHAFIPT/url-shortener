// hooks/auth/useGoogleCodeLogin.ts
import { useMutation } from "@tanstack/react-query";
import { googleCodeLoginApi } from "@/lib/auth/api";
import { setAccessToken } from "@/utils/tokenUtils";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slice/userSlice";
import type { AxiosError } from "axios";
import type { ApiError, LoginResponse } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useShortenUrl } from "../url/useShortenUrl";
import { popPendingUrl } from "@/utils/pendingUrl";
import toast from "react-hot-toast";

export const useGoogleCodeLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync: shortenUrlAsync } = useShortenUrl();

  return useMutation<LoginResponse, AxiosError<ApiError>, { code: string }>({
    mutationFn: ({ code }) => googleCodeLoginApi(code),
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
          console.log('❌ Google login shortenUrl failed:', error);
          toast.error("Failed to shorten your saved URL.");
          navigate("/", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
  });
};