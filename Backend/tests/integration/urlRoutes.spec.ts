import request from 'supertest';
import app from '../testApp';

describe('URL Routes', () => {
  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/url')
      .send({ longUrl: 'invalid-url' });

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app).get('/url/invalid123');
    expect(res.status).toBe(404);
  });
});