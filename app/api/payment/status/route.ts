import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cache } from '@/lib/cache/cache-service';
import { generateCacheKey } from '@/lib/cache/config';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const order_id = searchParams.get('order_id');

    if (!order_id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Try cache first
    const cacheKey = generateCacheKey('api', 'transaction', order_id);
    const cached = await cache.get(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        transaction: cached,
        cached: true,
      });
    }

    // Get transaction from database
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', order_id)
      .eq('user_id', user.id)
      .single();

    if (dbError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Cache the result (shorter TTL for pending transactions)
    const ttl = transaction.status === 'pending' ? 30 : 300; // 30s for pending, 5min for others
    await cache.set(cacheKey, transaction, { ttl });

    return NextResponse.json({
      success: true,
      transaction,
      cached: false,
    });
  } catch (error: any) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
