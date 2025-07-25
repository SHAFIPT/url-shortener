// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from './interfaces/routes/authRoutes';
import logger from './utils/logger';
import { errorHandler } from './interfaces/middlewares/errorHandler';

const app = express();
app.use(helmet());
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.http
      ? logger.http(message.trim())
      : logger.info(message.trim()),  
  } 
}));

app.use('/auth', authRoutes);
console.log("Mongo URI:", process.env.MONGO_URI);
app.get('/', (req, res) => {
  logger.info("Health check route accessed.");
  res.send("API is running.");
});
 
app.use(errorHandler);

export default app;
    