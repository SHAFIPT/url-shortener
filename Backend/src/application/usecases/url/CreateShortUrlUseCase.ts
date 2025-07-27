import { Messages } from "../../../constants/messages";
import { IShortCodeGenerator } from "../../../domain/interfaces/IShortCodeGenerator";
import { IUrlCacheService } from "../../../domain/interfaces/IUrlCacheService";
import { IUrlRepository } from "../../../domain/interfaces/repositories/IUrlRepository";
import { UrlDTO } from "../../dtos/url/UrlDTO";

export class CreateShortUrlUseCase {
  constructor(
    private readonly urlRepo: IUrlRepository,
    private readonly shortCodeGen: IShortCodeGenerator,
    private readonly urlCacheService: IUrlCacheService
  ) {}

  async execute(dto: UrlDTO) {
    const { longUrl, userId } = dto;

    const MAX_RETRIES = 5;
    let shortCode: string;
    let url;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      shortCode = await this.shortCodeGen.generate();

      try {
        url = await this.urlRepo.create({
          longUrl,
          userId,
          shortCode,
        });
        break; // success
      } catch (err: any) {
        if (err.code === 11000) {
          // Duplicate key error in MongoDB
          continue;
        } else {
          throw err;
        }
      }
    }

    if (!url) {
      throw new Error(Messages.SHORT_CODE_RETRY_FAILED);
    }

    await this.urlCacheService.setShortUrl(
      url.shortCode,
      longUrl,
      60 * 60 * 24 * 30
    );
    return `${process.env.BASE_URL}/${url.shortCode}`;
  }
}
