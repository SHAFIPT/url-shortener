jest.mock('../../src/config/redis', () => ({
  redis: {
    incr: jest.fn().mockResolvedValue(12345),
  },
}));

import { ShortCodeGenerator } from "../../src/infrastructure/services/ShortCodeGenerator";

describe('ShortCodeGenerator', () => {
  it('should generate a string of default length', async () => {
    const generator = new ShortCodeGenerator();
    const code = await generator.generate();
    expect(code).toHaveLength(7);
  });
});