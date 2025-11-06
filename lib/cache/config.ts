/**
 * Cache Configuration
 * Centralized cache settings for the application
 */

export const CACHE_CONFIG = {
  enabled: process.env.CACHE_ENABLED === 'true',
  defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10),
  maxMemory: process.env.CACHE_MAX_MEMORY || '100mb',

  // Cache key prefixes for organization
  prefixes: {
    user: 'user:',
    product: 'product:',
    order: 'order:',
    session: 'session:',
    api: 'api:',
    page: 'page:',
    query: 'query:',
  },

  // TTL settings for different data types (in seconds)
  ttl: {
    user: 3600,        // 1 hour
    product: 7200,     // 2 hours
    order: 1800,       // 30 minutes
    session: 86400,    // 24 hours
    api: 300,          // 5 minutes
    page: 3600,        // 1 hour
    query: 600,        // 10 minutes
    static: 604800,    // 1 week
  },

  // Stale-while-revalidate settings
  swr: {
    enabled: true,
    staleTime: 60,     // Consider data stale after 60 seconds
    revalidateTime: 300, // Revalidate every 5 minutes
  },
} as const;

export type CachePrefix = keyof typeof CACHE_CONFIG.prefixes;
export type CacheTTLType = keyof typeof CACHE_CONFIG.ttl;

/**
 * Generate cache key with prefix
 */
export function generateCacheKey(prefix: CachePrefix, ...parts: (string | number)[]): string {
  return `${CACHE_CONFIG.prefixes[prefix]}${parts.join(':')}`;
}

/**
 * Get TTL for specific cache type
 */
export function getCacheTTL(type: CacheTTLType): number {
  return CACHE_CONFIG.ttl[type];
}

/**
 * Check if caching is enabled
 */
export function isCacheEnabled(): boolean {
  return CACHE_CONFIG.enabled;
}
