import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../redux/store/store";
import { getAccessToken, setAccessToken } from "@/utils/tokenUtils";
import { logout } from "@/redux/slice/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

interface RefreshResponse {
  accessToken: string;
}

const normalizeBaseURL = (url: string): string => {
  if (!url) throw new Error("VITE_API_URL is missing");
  const trimmed = url.endsWith("/") ? url.slice(0, -1) : url;
  new URL(trimmed);
  return trimmed;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: normalizeBaseURL(API_URL),
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Error occurred:", error);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If already refreshing, wait for the existing refresh promise
        if (isRefreshing && refreshPromise) {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }

        // Start the refresh process
        isRefreshing = true;
        refreshPromise = refreshToken();

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear any stored tokens and logout user
        store.dispatch(logout());

        // Optionally redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken(): Promise<string> {
  try {
    const refreshInstance = axios.create({
      baseURL: normalizeBaseURL(API_URL),
      withCredentials: true,
    });

    const response = await refreshInstance.post<RefreshResponse>(
      "/auth/refresh"
    );

    const newToken = response.data?.accessToken;

    if (!newToken) {
      throw new Error("No access token received from refresh endpoint");
    }

    setAccessToken(newToken);
    return newToken;
  } catch (error) {
    console.error("Refresh token request failed:", error);
    throw error;
  }
}

export default axiosInstance;
