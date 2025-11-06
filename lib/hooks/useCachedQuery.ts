/**
 * React hook for cached Supabase queries
 */

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cache } from '@/lib/cache/cache-service';
import { generateCacheKey, getCacheTTL, CachePrefix, CacheTTLType } from '@/lib/cache/config';

export interface UseCachedQueryOptions {
  cacheKey?: string;
  cachePrefix?: CachePrefix;
  cacheTTL?: CacheTTLType;
  customTTL?: number;
  tags?: string[];
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useCachedQuery<T = any>(
  tableName: string,
  queryBuilder: (query: any) => any,
  options: UseCachedQueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const supabase = createClient();

  // Generate cache key
  const cacheKey = options.cacheKey || generateCacheKey(
    options.cachePrefix || 'query',
    tableName,
    JSON.stringify(queryBuilder.toString())
  );

  const fetchData = useCallback(async (bypassCache = false) => {
    if (options.enabled === false) return;

    setIsFetching(true);
    setError(null);

    try {
      // Try cache first
      if (!bypassCache) {
        const cached = await cache.get<T>(cacheKey);
        if (cached !== null) {
          setData(cached);
          setLoading(false);
          setIsFetching(false);
          options.onSuccess?.(cached);
          return;
        }
      }

      // Fetch from database
      const { data: freshData, error: queryError } = await queryBuilder(
        supabase.from(tableName)
      );

      if (queryError) throw queryError;

      // Update cache
      if (freshData) {
        const ttl = options.customTTL || (options.cacheTTL ? getCacheTTL(options.cacheTTL) : getCacheTTL('query'));
        await cache.set(cacheKey, freshData, {
          ttl,
          tags: options.tags,
        });
      }

      setData(freshData);
      options.onSuccess?.(freshData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      console.error('Query error:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [tableName, cacheKey, options.enabled]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(async () => {
    await cache.delete(cacheKey);
    if (options.tags) {
      for (const tag of options.tags) {
        await cache.invalidateByTag(tag);
      }
    }
    return fetchData(true);
  }, [cacheKey, options.tags, fetchData]);

  useEffect(() => {
    if (options.refetchOnMount !== false) {
      fetchData();
    }
  }, [fetchData, options.refetchOnMount]);

  // Auto refetch interval
  useEffect(() => {
    if (options.refetchInterval && options.refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchData(true);
      }, options.refetchInterval);

      return () => clearInterval(interval);
    }
  }, [options.refetchInterval, fetchData]);

  return {
    data,
    loading,
    error,
    isFetching,
    refetch,
    invalidate,
  };
}

/**
 * Specific hooks for common queries
 */

export function useCachedProducts(options: UseCachedQueryOptions = {}) {
  return useCachedQuery(
    'produk',
    (query) => query.select('*').order('created_at', { ascending: false }),
    {
      ...options,
      cachePrefix: 'product',
      cacheTTL: 'product',
      tags: ['products', ...(options.tags || [])],
    }
  );
}

export function useCachedProduct(id: number, options: UseCachedQueryOptions = {}) {
  return useCachedQuery(
    'produk',
    (query) => query.select('*').eq('id', id).single(),
    {
      ...options,
      cacheKey: generateCacheKey('product', id.toString()),
      cacheTTL: 'product',
      tags: ['products', `product:${id}`, ...(options.tags || [])],
    }
  );
}

export function useCachedClasses(options: UseCachedQueryOptions = {}) {
  return useCachedQuery(
    'kelas_video',
    (query) => query.select('*').order('created_at', { ascending: false }),
    {
      ...options,
      cachePrefix: 'query',
      tags: ['classes', ...(options.tags || [])],
    }
  );
}

export function useCachedUserTransactions(userId: string, options: UseCachedQueryOptions = {}) {
  return useCachedQuery(
    'transactions',
    (query) => query.select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    {
      ...options,
      cacheKey: generateCacheKey('user', userId, 'transactions'),
      cacheTTL: 'order',
      tags: ['transactions', `user:${userId}:transactions`, ...(options.tags || [])],
    }
  );
}

export function useCachedCoachingSessions(options: UseCachedQueryOptions = {}) {
  return useCachedQuery(
    'coaching_schedule',
    (query) => query.select('*').order('date', { ascending: true }),
    {
      ...options,
      cachePrefix: 'query',
      tags: ['coaching', ...(options.tags || [])],
    }
  );
}
