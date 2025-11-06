/**
 * API Route: Get cache statistics
 */

import { NextResponse } from 'next/server';
import { getCacheService } from '@/lib/cache/cache-service';
import { getRedisClient } from '@/lib/cache/redis-client';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cacheService = getCacheService();
    const redisClient = getRedisClient();

    const stats = cacheService.getStats();
    const memoryStats = await redisClient.getMemoryStats();
    const isRedisAvailable = redisClient.isAvailable();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        memory: memoryStats,
        backend: isRedisAvailable ? 'redis' : 'memory',
        isRedisAvailable,
      },
    });
  } catch (error: any) {
    console.error('Cache stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}
