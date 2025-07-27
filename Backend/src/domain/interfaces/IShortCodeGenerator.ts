export interface IShortCodeGenerator {
  generate(length?: number): Promise<string>;
}
