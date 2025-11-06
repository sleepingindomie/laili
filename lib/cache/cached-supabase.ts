/**
 * Cached Supabase Query Wrapper
 * Automatically caches Supabase query results
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from './cache-service';
import { generateCacheKey, getCacheTTL } from './config';

export interface CachedQueryOptions {
  ttl?: number;
  tags?: string[];
  key?: string;
  bypassCache?: boolean;
}

/**
 * Cached Supabase query wrapper
 */
export async function cachedQuery<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  queryBuilder: (query: any) => any,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  // Generate cache key
  const cacheKey = options.key || generateCacheKey(
    'query',
    tableName,
    JSON.stringify(queryBuilder.toString())
  );

  // Bypass cache if requested
  if (options.bypassCache) {
    const { data, error } = await queryBuilder(supabase.from(tableName));
    if (error) throw error;
    return data;
  }

  // Try to get from cache
  const cached = await cache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  const { data, error } = await queryBuilder(supabase.from(tableName));
  if (error) throw error;

  // Store in cache
  if (data) {
    await cache.set(cacheKey, data, {
      ttl: options.ttl || getCacheTTL('query'),
      tags: options.tags,
    });
  }

  return data;
}

/**
 * Invalidate cache for specific table
 */
export async function invalidateTableCache(tableName: string): Promise<void> {
  await cache.invalidateByTag(tableName);
  await cache.deletePattern(`query:${tableName}:*`);
}

/**
 * Cached RPC call wrapper
 */
export async function cachedRPC<T = any>(
  supabase: SupabaseClient,
  functionName: string,
  params?: object,
  options: CachedQueryOptions = {}
): Promise<T | null> {
  // Generate cache key
  const cacheKey = options.key || generateCacheKey(
    'api',
    'rpc',
    functionName,
    JSON.stringify(params || {})
  );

  // Bypass cache if requested
  if (options.bypassCache) {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) throw error;
    return data;
  }

  // Try to get from cache
  const cached = await cache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Execute RPC
  const { data, error } = await supabase.rpc(functionName, params);
  if (error) throw error;

  // Store in cache
  if (data) {
    await cache.set(cacheKey, data, {
      ttl: options.ttl || getCacheTTL('api'),
      tags: options.tags,
    });
  }

  return data;
}

/**
 * Example usage helper functions
 */

export async function getCachedProducts(
  supabase: SupabaseClient,
  options: CachedQueryOptions = {}
): Promise<any[]> {
  const data = await cachedQuery(
    supabase,
    'produk',
    (query) => query.select('*').order('created_at', { ascending: false }),
    {
      ...options,
      tags: ['products', ...(options.tags || [])],
      ttl: options.ttl || getCacheTTL('product'),
    }
  );

  return data || [];
}

export async function getCachedProductById(
  supabase: SupabaseClient,
  id: number,
  options: CachedQueryOptions = {}
): Promise<any | null> {
  const data = await cachedQuery(
    supabase,
    'produk',
    (query) => query.select('*').eq('id', id).single(),
    {
      ...options,
      key: generateCacheKey('product', id.toString()),
      tags: ['products', `product:${id}`, ...(options.tags || [])],
      ttl: options.ttl || getCacheTTL('product'),
    }
  );

  return data;
}

export async function getCachedClasses(
  supabase: SupabaseClient,
  options: CachedQueryOptions = {}
): Promise<any[]> {
  const data = await cachedQuery(
    supabase,
    'kelas_video',
    (query) => query.select('*').order('created_at', { ascending: false }),
    {
      ...options,
      tags: ['classes', ...(options.tags || [])],
      ttl: options.ttl || getCacheTTL('query'),
    }
  );

  return data || [];
}

export async function getCachedUserOrders(
  supabase: SupabaseClient,
  userId: string,
  options: CachedQueryOptions = {}
): Promise<any[]> {
  const data = await cachedQuery(
    supabase,
    'pesanan',
    (query) => query.select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    {
      ...options,
      key: generateCacheKey('order', userId, 'list'),
      tags: ['orders', `user:${userId}:orders`, ...(options.tags || [])],
      ttl: options.ttl || getCacheTTL('order'),
    }
  );

  return data || [];
}

export async function getCachedUserTransactions(
  supabase: SupabaseClient,
  userId: string,
  options: CachedQueryOptions = {}
): Promise<any[]> {
  const data = await cachedQuery(
    supabase,
    'transactions',
    (query) => query.select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    {
      ...options,
      key: generateCacheKey('user', userId, 'transactions'),
      tags: ['transactions', `user:${userId}:transactions`, ...(options.tags || [])],
      ttl: options.ttl || getCacheTTL('order'),
    }
  );

  return data || [];
}
