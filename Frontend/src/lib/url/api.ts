import axiosInstance from "../http";
import type {
  DashboardStats,
  GetMyUrlsParams,
  PaginatedResponse,
  ShortenPayload,
  ShortenResponse,
  UserUrl,
} from "@/types/url";

export const shortenUrlApi = async (body: ShortenPayload) => {
  const { data } = await axiosInstance.post<ShortenResponse>("/url", body);
  return data;
};

export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  const { data } = await axiosInstance.get("/url/stats");
  return data;
};

export const getMyUrlsApi = async (
  params: GetMyUrlsParams = {}
): Promise<PaginatedResponse<UserUrl>> => {
  const { data } = await axiosInstance.get("/url/getUrls", { params });
  return data;
};
