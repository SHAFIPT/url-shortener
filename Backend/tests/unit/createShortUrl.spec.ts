import { CreateShortUrlUseCase } from '../../src/application/usecases/url/CreateShortUrlUseCase';

const mockRepo = {
  create: jest.fn().mockResolvedValue({ shortCode: 'abc123' }), // <-- fixed
};
const mockGen = {
  generate: jest.fn().mockResolvedValue('abc123'),
};
const mockCache = {
  setShortUrl: jest.fn(),
};

describe('CreateShortUrlUseCase', () => {
  it('should create a short URL successfully', async () => {
    const useCase = new CreateShortUrlUseCase(
      mockRepo as any,
      mockGen as any,
      mockCache as any
    );

    const result = await useCase.execute({
      longUrl: 'https://example.com',
      userId: 'user123',
    });

    expect(mockGen.generate).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
    expect(result).toContain('abc123');
  });
});
