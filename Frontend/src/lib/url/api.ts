import axiosInstance from '../http'
import type { ClicksOverTimeData, DashboardStats, GetMyUrlsParams, PaginatedResponse, ShortenPayload, ShortenResponse, UserUrl } from '@/types/url';

export const shortenUrlApi = async (body: ShortenPayload) => {
  const { data } = await axiosInstance.post<ShortenResponse>('/url', body);
  console.log('this the url data get in bakdnd :',data)  
  return data;
};

export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  const { data } = await axiosInstance.get('/url/stats');
  return data;
};

export const getMyUrlsApi = async (
  params: GetMyUrlsParams = {}
): Promise<PaginatedResponse<UserUrl>> => {
  const { data } = await axiosInstance.get('/url', { params });
  return data;
};

export const getClicksOverTimeApi = async (
  days = 30
): Promise<ClicksOverTimeData[]> => {
  const { data } = await axiosInstance.get('/analytics/clicks', {
    params: { days }
  });
  return data;
};