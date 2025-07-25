import { createClient } from 'redis';
import { env } from './env';

// For Upstash, you need TLS configuration
export const redis = createClient({
  url: env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false, 
  },
});

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}

// Handle connection errors
redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Redis Client Connected');
});

redis.on('ready', () => {
  console.log('Redis Client Ready');
});