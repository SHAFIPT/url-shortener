import { IUrlRepository } from "../../../domain/interfaces/repositories/IUrlRepository";

type Input = { userId: string };
type Output = {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiringSoon: number;
  dailyUsage: number;
  dailyLimit: number;
  plan: "Free" | "Premium";
};
   
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT ?? 100);

export class GetDashboardStatsUseCase {
  constructor(private readonly urlRepo: IUrlRepository) {}

  async execute({ userId }: Input): Promise<Output> {
    const [totalUrls, activeUrls, expiringSoon, totalClicks, dailyUsage] =
      await Promise.all([
        this.urlRepo.countByUser(userId),
        this.urlRepo.countActiveByUser(userId),
        this.urlRepo.countExpiringSoonByUser(userId, 7),
        this.urlRepo.sumClicksByUser(userId),
        this.urlRepo.countTodayByUser(userId),
      ]);

    return {
      totalUrls,
      activeUrls,
      expiringSoon,
      totalClicks,
      dailyUsage,
      dailyLimit: DAILY_LIMIT,
      plan: "Free",
    };
  }
}
