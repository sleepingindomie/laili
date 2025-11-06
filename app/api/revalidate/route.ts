/**
 * API Route: On-demand revalidation for Next.js cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, secret } = body;

    // Verify secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    // Revalidate specific path
    revalidatePath(path, 'page');

    return NextResponse.json({
      success: true,
      message: `Path ${path} revalidated`,
      revalidated: true,
    });
  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
