export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
