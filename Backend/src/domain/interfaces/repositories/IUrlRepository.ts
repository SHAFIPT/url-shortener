import { IUrl } from "../../entities/Iurl";

export interface IUrlRepository {
  create(data: { longUrl: string; shortCode: string; userId: string }): Promise<IUrl>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  countTodayByUser(userId: string): Promise<number>;
}