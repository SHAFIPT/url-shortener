import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store/store";
import { getAccessToken, setAccessToken } from "@/utils/tokenUtils";
import { logout } from "@/redux/slice/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

interface RefreshResponse {
  accessToken: string;
}

interface QueuedRequest {
  resolve: (value: string) => void;
  reject: (error: AxiosError) => void;
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
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    } else {
      reject(new Error("No token available") as AxiosError);
    }
  });
  
  failedQueue = [];
};

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
    console.log('Error occurred:', error);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err: AxiosError) => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Create a separate axios instance for refresh to avoid interceptor loops
        const refreshInstance = axios.create({
          baseURL: normalizeBaseURL(API_URL),
          withCredentials: true, // Important: This sends the httpOnly refresh token cookie
        });
        
        const response = await refreshInstance.post<RefreshResponse>('/auth/refresh');
        const newToken = response.data?.accessToken;
        
        console.log("New token received from backend:", newToken);
        
        if (!newToken) {
          throw new Error("No access token received from refresh endpoint");
        }
        
        setAccessToken(newToken);
        processQueue(null, newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        const axiosRefreshError = refreshError as AxiosError;
        processQueue(axiosRefreshError, null);
        
        // Clear any stored tokens and logout user
        store.dispatch(logout());
        
        // Optionally redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;