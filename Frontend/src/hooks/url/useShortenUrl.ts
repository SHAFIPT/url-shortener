// lib/url/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { type ApiError } from '@/types/auth';
import type { ShortenPayload, ShortenResponse } from '@/types/url';
import { shortenUrlApi } from '@/lib/url/api';
import { toast } from 'react-hot-toast';
import { DASHBOARD_STATS_QUERY_KEY } from './useDashboardStats';

export const useShortenUrl = () => {
  const qc = useQueryClient();
  return useMutation<ShortenResponse, AxiosError<ApiError>, ShortenPayload>({
    mutationFn: shortenUrlApi,
    onSuccess: () => {
      toast.success('URL shortened successfully'); 
      qc.invalidateQueries({ queryKey: ["urls", "me"] });
      qc.invalidateQueries({ queryKey: DASHBOARD_STATS_QUERY_KEY });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Something went wrong';
      toast.error(message); 
    },
  });
};
