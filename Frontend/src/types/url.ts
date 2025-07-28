export type ShortenPayload = {
  longUrl: string;
  customAlias?: string;
};

export type ShortenResponse = {
  id: string;
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
};

export type DashboardStats = {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiringSoon: number;
  dailyUsage: number;
  dailyLimit: number;
  plan: 'Free' | 'Premium';
};

export type UserUrl = {
  _id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetMyUrlsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
};
