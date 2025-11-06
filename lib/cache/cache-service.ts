/**
 * Comprehensive Cache Service
 * Supports both Redis and in-memory fallback
 */

import { getRedisClient } from './redis-client';
import { getMemoryCache } from './memory';
import { generateCacheKey, getCacheTTL, isCacheEnabled, CachePrefix, CacheTTLType } from './config';

export interface CacheOptions {
  ttl?: number;
  prefix?: CachePrefix;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

class CacheService {
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
  };

  /**
   * Get value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (!isCacheEnabled()) return null;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          const value = await client.get(key);
          if (value) {
            this.stats.hits++;
            this.updateHitRate();
            return JSON.parse(value) as T;
          }
        }
      } else {
        // Fallback to memory cache
        const memoryCache = getMemoryCache();
        const value = memoryCache.get<T>(key);
        if (value) {
          this.stats.hits++;
          this.updateHitRate();
          return value;
        }
      }

      this.stats.misses++;
      this.updateHitRate();
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T = any>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    if (!isCacheEnabled()) return false;

    const redis = getRedisClient();
    const ttl = options.ttl || getCacheTTL('api');

    try {
      const serialized = JSON.stringify(value);

      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          if (ttl) {
            await client.setex(key, ttl, serialized);
          } else {
            await client.set(key, serialized);
          }

          // Store tags for cache invalidation
          if (options.tags && options.tags.length > 0) {
            await this.setTags(key, options.tags);
          }

          this.stats.sets++;
          return true;
        }
      } else {
        // Fallback to memory cache
        const memoryCache = getMemoryCache();
        memoryCache.set(key, value, ttl);
        this.stats.sets++;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!isCacheEnabled()) return false;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          await client.del(key);
          this.stats.deletes++;
          return true;
        }
      } else {
        const memoryCache = getMemoryCache();
        memoryCache.delete(key);
        this.stats.deletes++;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!isCacheEnabled()) return 0;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          const keys = await client.keys(pattern);
          if (keys.length > 0) {
            await client.del(...keys);
            this.stats.deletes += keys.length;
            return keys.length;
          }
        }
      }

      return 0;
    } catch (error) {
      console.error('Cache pattern delete error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    if (!isCacheEnabled()) return false;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          const exists = await client.exists(key);
          return exists === 1;
        }
      } else {
        const memoryCache = getMemoryCache();
        return memoryCache.has(key);
      }

      return false;
    } catch (error) {
      console.error('Cache exists check error:', error);
      return false;
    }
  }

  /**
   * Get or set cache (fetch if not exists)
   */
  async getOrSet<T = any>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const fresh = await fetchFn();

    // Store in cache
    await this.set(key, fresh, options);

    return fresh;
  }

  /**
   * Get multiple values at once
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (!isCacheEnabled() || keys.length === 0) return [];

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          const values = await client.mget(...keys);
          return values.map((v) => (v ? JSON.parse(v) as T : null));
        }
      } else {
        const memoryCache = getMemoryCache();
        return keys.map((key) => memoryCache.get<T>(key));
      }

      return [];
    } catch (error) {
      console.error('Cache mget error:', error);
      return [];
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    if (!isCacheEnabled() || entries.length === 0) return false;

    try {
      const promises = entries.map((entry) =>
        this.set(entry.key, entry.value, { ttl: entry.ttl })
      );
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1): Promise<number | null> {
    if (!isCacheEnabled()) return null;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          return await client.incrby(key, amount);
        }
      }

      return null;
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, amount: number = 1): Promise<number | null> {
    if (!isCacheEnabled()) return null;

    const redis = getRedisClient();

    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        if (client) {
          return await client.decrby(key, amount);
        }
      }

      return null;
    } catch (error) {
      console.error('Cache decrement error:', error);
      return null;
    }
  }

  /**
   * Set cache tags for invalidation
   */
  private async setTags(key: string, tags: string[]): Promise<void> {
    const redis = getRedisClient();
    if (!redis.isAvailable()) return;

    const client = redis.getClient();
    if (!client) return;

    try {
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        await client.sadd(tagKey, key);
      }
    } catch (error) {
      console.error('Failed to set cache tags:', error);
    }
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    const redis = getRedisClient();
    if (!redis.isAvailable()) return 0;

    const client = redis.getClient();
    if (!client) return 0;

    try {
      const tagKey = `tag:${tag}`;
      const keys = await client.smembers(tagKey);

      if (keys.length > 0) {
        await client.del(...keys);
        await client.del(tagKey);
        this.stats.deletes += keys.length;
        return keys.length;
      }

      return 0;
    } catch (error) {
      console.error('Failed to invalidate by tag:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      hitRate: 0,
    };
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Warm up cache with data
   */
  async warmUp(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    console.log(`Warming up cache with ${entries.length} entries...`);
    await this.mset(entries);
    console.log('Cache warm-up complete');
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<boolean> {
    const redis = getRedisClient();

    if (redis.isAvailable()) {
      return await redis.flushAll();
    } else {
      const memoryCache = getMemoryCache();
      memoryCache.clear();
      return true;
    }
  }
}

// Singleton instance
let cacheServiceInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
  }
  return cacheServiceInstance;
}

// Convenience exports
export const cache = {
  get: <T = any>(key: string) => getCacheService().get<T>(key),
  set: <T = any>(key: string, value: T, options?: CacheOptions) =>
    getCacheService().set(key, value, options),
  delete: (key: string) => getCacheService().delete(key),
  deletePattern: (pattern: string) => getCacheService().deletePattern(pattern),
  has: (key: string) => getCacheService().has(key),
  getOrSet: <T = any>(key: string, fetchFn: () => Promise<T>, options?: CacheOptions) =>
    getCacheService().getOrSet<T>(key, fetchFn, options),
  mget: <T = any>(keys: string[]) => getCacheService().mget<T>(keys),
  mset: (entries: Array<{ key: string; value: any; ttl?: number }>) =>
    getCacheService().mset(entries),
  increment: (key: string, amount?: number) => getCacheService().increment(key, amount),
  decrement: (key: string, amount?: number) => getCacheService().decrement(key, amount),
  invalidateByTag: (tag: string) => getCacheService().invalidateByTag(tag),
  getStats: () => getCacheService().getStats(),
  resetStats: () => getCacheService().resetStats(),
  warmUp: (entries: Array<{ key: string; value: any; ttl?: number }>) =>
    getCacheService().warmUp(entries),
  clear: () => getCacheService().clear(),
};

export { CacheService };
