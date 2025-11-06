import { useEffect, useState } from 'react';
import { getMemoryCache } from '@/lib/cache/memory';

interface UseCacheOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  ttl?: number; // seconds
  enabled?: boolean;
}

export function useCache<T>({
  key,
  fetchFn,
  ttl,
  enabled = true,
}: UseCacheOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cache = getMemoryCache();

  const fetchData = async (force = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Try cache first (unless force refresh)
      if (!force) {
        const cached = cache.get<T>(key);
        if (cached !== null) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const fresh = await fetchFn();

      // Store in cache
      cache.set(key, fresh, ttl);

      setData(fresh);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const invalidate = () => {
    cache.delete(key);
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, [key, enabled]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidate,
  };
}
