import express from 'express';

jest.mock('../src/interfaces/middlewares/authMiddleware', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  },
}));

import { urlRoutes } from '../src/interfaces/routes/urlRoutes'; 

const app = express();
app.use(express.json());
app.use('/url', urlRoutes);

export default app;
