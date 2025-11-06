/**
 * Enhanced Redis Client with connection pooling and error handling
 */

import Redis, { RedisOptions } from 'ioredis';
import { isCacheEnabled } from './config';

class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 3;

  constructor() {
    if (isCacheEnabled() && process.env.REDIS_URL) {
      this.connect();
    }
  }

  private connect(): void {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.error('Max Redis connection attempts reached. Running without cache.');
      return;
    }

    try {
      const options: RedisOptions = {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err: Error) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
        lazyConnect: true,
        enableReadyCheck: true,
        enableOfflineQueue: true,
      };

      this.client = new Redis(process.env.REDIS_URL!, options);

      this.client.on('connect', () => {
        console.log('✓ Redis connected successfully');
        this.isConnected = true;
        this.connectionAttempts = 0;
      });

      this.client.on('ready', () => {
        console.log('✓ Redis ready to accept commands');
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis error:', err.message);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        console.log('Redis reconnecting...');
        this.connectionAttempts++;
      });

      // Attempt initial connection
      this.client.connect().catch((err) => {
        console.error('Failed to connect to Redis:', err.message);
        this.connectionAttempts++;
      });
    } catch (error) {
      console.error('Error creating Redis client:', error);
      this.connectionAttempts++;
    }
  }

  /**
   * Get the Redis client instance
   */
  public getClient(): Redis | null {
    if (!this.isConnected || !this.client) {
      return null;
    }
    return this.client;
  }

  /**
   * Check if Redis is available
   */
  public isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Ping Redis to check connection
   */
  public async ping(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const response = await this.client.ping();
      return response === 'PONG';
    } catch (error) {
      console.error('Redis ping failed:', error);
      return false;
    }
  }

  /**
   * Get Redis info
   */
  public async getInfo(): Promise<Record<string, string> | null> {
    if (!this.client) return null;

    try {
      const info = await this.client.info();
      const lines = info.split('\r\n');
      const result: Record<string, string> = {};

      for (const line of lines) {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            result[key.trim()] = value.trim();
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to get Redis info:', error);
      return null;
    }
  }

  /**
   * Get memory usage statistics
   */
  public async getMemoryStats(): Promise<{
    used: string;
    peak: string;
    fragmentation: string;
  } | null> {
    const info = await this.getInfo();
    if (!info) return null;

    return {
      used: info.used_memory_human || 'N/A',
      peak: info.used_memory_peak_human || 'N/A',
      fragmentation: info.mem_fragmentation_ratio || 'N/A',
    };
  }

  /**
   * Flush all data (use with caution!)
   */
  public async flushAll(): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.flushall();
      console.log('Redis cache flushed');
      return true;
    } catch (error) {
      console.error('Failed to flush Redis:', error);
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      console.log('Redis disconnected');
    }
  }
}

// Singleton instance
let redisClientInstance: RedisClient | null = null;

export function getRedisClient(): RedisClient {
  if (!redisClientInstance) {
    redisClientInstance = new RedisClient();
  }
  return redisClientInstance;
}

export { RedisClient };
