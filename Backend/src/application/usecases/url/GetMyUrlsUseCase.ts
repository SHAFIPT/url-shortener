import { IUrl } from "../../../domain/entities/Iurl";
import { IUrlRepository } from "../../../domain/interfaces/repositories/IUrlRepository";

interface Input {
  userId: string;
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  search: string;
}

interface Output {
  data: IUrl[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetMyUrlsUseCase {
  constructor(private readonly urlRepo: IUrlRepository) {}

  async execute(input: Input): Promise<Output> {
    const { userId, page, limit, sortBy, order, search } = input;
    console.log('userId',userId)
    console.log('page',page)
    console.log('limit',limit)
    console.log('sortBy',sortBy)
    console.log('order',order)
    console.log('search',search)
    const [total, urls] = await Promise.all([
      this.urlRepo.countFiltered(userId, search),
      this.urlRepo.findManyByUser({
        userId,
        page,
        limit,
        sortBy,
        order,
        search,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    console.log('This ithe return url :',urls)
    return {
      data: urls,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}