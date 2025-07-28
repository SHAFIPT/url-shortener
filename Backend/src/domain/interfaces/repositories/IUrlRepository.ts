import { IUrl } from "../../entities/Iurl";

export interface IUrlRepository {
  create(data: { longUrl: string; shortCode: string; userId: string }): Promise<IUrl>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  countTodayByUser(userId: string): Promise<number>;
  countByUser(userId: string): Promise<number>;
  countActiveByUser(userId: string): Promise<number>;
  countExpiringSoonByUser(userId: string, days: number): Promise<number>;
  sumClicksByUser(userId: string): Promise<number>;
  findManyByUser(params: {
    userId: string;
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
    search: string;
  }): Promise<IUrl[]>;
  countFiltered(userId: string, search: string): Promise<number>;
}