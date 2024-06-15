import Redis from 'ioredis';
import { Logger } from './logger.helper';
import { SessionRole } from '../types';

export const redisClient = new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
})
  .on('connect', () => {
    Logger.info(`Redis is listening on port ${process.env.REDIS_PORT}`);
  })
  .on('error', (error) => {
    Logger.error(`Redis connection failed: ${error}`);
    process.exit(1);
  });

export class SessionRedis {
  static setSession(role: keyof typeof SessionRole, userId: string, expiresIn: number, token: string) {
    if (!userId) throw new Error('userId is required');
    if (!token) throw new Error('token is required');
    try {
      return redisClient.setex(`${SessionRole[role]}:${userId}`, expiresIn, token);
    } catch (error) {
      console.error(error);
    }
  }

  static getSession(role: keyof typeof SessionRole, userId: string) {
    if (!userId) throw new Error('userId is required');
    return redisClient.get(`${SessionRole[role]}:${userId}`);
  }

  static deleteSession(role: keyof typeof SessionRole, userId: string) {
    if (!userId) throw new Error('userId is required');
    try {
      return redisClient.del(`${SessionRole[role]}:${userId}`);
    } catch (error) {
      console.error(error);
    }
  }
}
