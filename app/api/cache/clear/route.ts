/**
 * API Route: Clear cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCacheService } from '@/lib/cache/cache-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

    // TODO: Check if user has admin permission

    const body = await request.json();
    const { pattern, tag } = body;

    const cacheService = getCacheService();
    let deletedCount = 0;

    if (pattern) {
      // Clear by pattern
      deletedCount = await cacheService.deletePattern(pattern);
    } else if (tag) {
      // Clear by tag
      deletedCount = await cacheService.invalidateByTag(tag);
    } else {
      // Clear all cache
      await cacheService.clear();
      deletedCount = -1; // Indicate all cleared
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      message: deletedCount === -1
        ? 'All cache cleared'
        : `Cleared ${deletedCount} cache entries`,
    });
  } catch (error: any) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
