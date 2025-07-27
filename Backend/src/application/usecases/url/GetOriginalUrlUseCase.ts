import { Messages } from '../../../constants/messages';
import { IUrlCacheService } from '../../../domain/interfaces/IUrlCacheService';
import { IUrlRepository } from '../../../domain/interfaces/repositories/IUrlRepository';
import { GoneError } from '../../errors/GoneError';
import { NotFoundError } from '../../errors/NotFoundError';

export class GetOriginalUrlUseCase {
  constructor(
    private readonly urlRepo: IUrlRepository,
    private readonly urlCacheService: IUrlCacheService
  ) {}

  async execute({ shortCode }: { shortCode: string }): Promise<string> {
    const cached = await this.urlCacheService.getLongUrl(`short:${shortCode}`);
    if (cached) return cached;

    const url = await this.urlRepo.findByShortCode(shortCode);
    if (!url) {
      throw new NotFoundError(Messages.URL_NOT_FOUND);
    }

    if (!url.isActive || !url.expiresAt || url.expiresAt < new Date()) {
      throw new GoneError(Messages.URL_EXPIRED);
    }

    await this.urlCacheService.setShortUrl(shortCode, url.longUrl, 60 * 60 * 24);

    return url.longUrl;
  }
}
