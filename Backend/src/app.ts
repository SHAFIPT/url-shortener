// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from './interfaces/routes/authRoutes';
import logger from './utils/logger';
import { authErrorHandler } from './interfaces/middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { urlRoutes } from './interfaces/routes/urlRoutes';
import { urlErrorHandler } from './interfaces/middlewares/urlErrorHandler';
import { publicRedirectRoutes } from './interfaces/routes/publicRedirectRoutes';

const app = express();
app.use(helmet());
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use(morgan("combined", {
  stream: {
    write: (message) => logger.http
      ? logger.http(message.trim())
      : logger.info(message.trim()),  
  } 
}));
app.use(publicRedirectRoutes); 
app.use('/auth', authRoutes);
app.use('/url', urlRoutes);
app.get('/', (req, res) => {
  logger.info("Health check route accessed.");
  res.send("API is running.");
});
 
app.use('/auth', authErrorHandler);
app.use('/url', urlErrorHandler);

export default app;
    