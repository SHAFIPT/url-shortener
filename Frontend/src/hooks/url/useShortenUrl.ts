// lib/url/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { type ApiError } from '@/types/auth';
import type { ShortenPayload, ShortenResponse } from '@/types/url';
import { shortenUrlApi } from '@/lib/url/api';

export const useShortenUrl = () => {
  const qc = useQueryClient();
  return useMutation<ShortenResponse, AxiosError<ApiError>, ShortenPayload>({
    mutationFn: shortenUrlApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['urls', 'list'] });
    },
  });
};
