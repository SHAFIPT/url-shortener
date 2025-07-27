import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyUrlsApi } from "@/lib/url/api";
import type { GetMyUrlsParams } from "@/types/url";

export const MY_URLS_QUERY_KEY = (params: GetMyUrlsParams) => [
  "urls",
  "me",
  params,
];

export const useMyUrls = (params: GetMyUrlsParams) =>
  useQuery({
    queryKey: MY_URLS_QUERY_KEY(params),
    queryFn: () => getMyUrlsApi(params),
    placeholderData: keepPreviousData,
  });
