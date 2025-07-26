import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env FIRST

import app from './app';
import logger from './utils/logger';
import { connectMongo } from './config/mongo';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMongo(); 
    await connectRedis();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    process.exit(1); 
  }
};

startServer();
