/**
 * API Route: Save Web Vitals Metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { metric, url, userAgent, timestamp } = body;

    // Save to database (create table if needed)
    const { error } = await supabase
      .from('web_vitals')
      .insert({
        user_id: user?.id,
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        url,
        user_agent: userAgent,
        recorded_at: new Date(timestamp).toISOString(),
      });

    if (error) {
      // Table might not exist yet, that's okay
      console.error('Web vitals save error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Web vitals API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save web vitals' },
      { status: 500 }
    );
  }
}
