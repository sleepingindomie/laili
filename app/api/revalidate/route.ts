/**
 * API Route: On-demand revalidation for Next.js cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (path) {
      // Revalidate specific path
      revalidatePath(path, 'page');
      return NextResponse.json({
        success: true,
        message: `Path ${path} revalidated`,
        revalidated: true,
      });
    }

    if (tag) {
      // Revalidate by tag
      await revalidateTag(tag);
      return NextResponse.json({
        success: true,
        message: `Tag ${tag} revalidated`,
        revalidated: true,
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
