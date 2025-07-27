
import { IUrl } from '../../../domain/entities/Iurl';
import { IUrlRepository } from '../../../domain/interfaces/repositories/IUrlRepository';
import Url from '../models/url.model';

export class UrlRepoMongo implements IUrlRepository {
  async create(data: { longUrl: string; shortCode: string; userId: string }): Promise<IUrl> {
    return await Url.create({
      longUrl: data.longUrl,
      shortCode: data.shortCode,
      userId: data.userId,
    });
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    return await Url.findOne({ shortCode });
  }

  async countTodayByUser(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await Url.countDocuments({
      userId,
      createdAt: { $gte: today },
    });
  }
}
