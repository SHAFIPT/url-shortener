import { Types } from "mongoose";
import { IUrl } from "../../../domain/entities/Iurl";
import { IUrlRepository } from "../../../domain/interfaces/repositories/IUrlRepository";
import Url from "../models/url.model";

export class UrlRepoMongo implements IUrlRepository {
  async create(data: {
    longUrl: string;
    shortCode: string;
    userId: string;
  }): Promise<IUrl> {
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
  async countByUser(userId: string): Promise<number> {
    return Url.countDocuments({ userId });
  }

  async countActiveByUser(userId: string): Promise<number> {
    return Url.countDocuments({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
  }

  async countExpiringSoonByUser(userId: string, days: number): Promise<number> {
    const now = new Date();
    const soon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return Url.countDocuments({
      userId,
      isActive: true,
      expiresAt: { $gt: now, $lte: soon },
    });
  }

  async sumClicksByUser(userId: string): Promise<number> {
    const res = await Url.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$clicks" } } },
    ]);

    return res?.[0]?.total ?? 0;
  }
  async findManyByUser({
    userId,
    page,
    limit,
    sortBy,
    order,
    search,
  }: {
    userId: string;
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
    search: string;
  }): Promise<IUrl[]> {
    const query: any = {
      userId: new Types.ObjectId(userId),
    };

    if (search) {
      query.$or = [
        { longUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
      ];
    }

    const result = await Url.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return result;
  }

  async countFiltered(userId: string, search: string): Promise<number> {
    const query: any = {
      userId: new Types.ObjectId(userId),
    };

    if (search) {
      query.$or = [
        { longUrl: { $regex: search, $options: "i" } },
        { shortCode: { $regex: search, $options: "i" } },
      ];
    }

    const count = await Url.countDocuments(query);
    return count;
  }
}
