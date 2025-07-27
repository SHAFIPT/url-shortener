import { getDashboardStatsApi } from '@/lib/url/api';
import { useQuery } from '@tanstack/react-query';

export const DASHBOARD_STATS_QUERY_KEY = ['dashboard', 'stats'];

export const useDashboardStats = () =>
  useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: getDashboardStatsApi,
    staleTime: 60_000, 
    retry: 1,
  });