import { createClient } from 'redis';
import { config } from 'dotenv';
config();

export const redisClient = createClient({ url: process.env.REDIS_URL });