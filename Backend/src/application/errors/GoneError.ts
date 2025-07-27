export class GoneError extends Error {
  constructor(message = 'URL has expired') {
    super(message);
    this.name = 'GoneError';
  }
}