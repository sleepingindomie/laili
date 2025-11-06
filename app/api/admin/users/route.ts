/**
 * Admin API: User Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/rbac/middleware';

export async function GET(request: NextRequest) {
  try {
    // Check admin permission
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    // Get users with their roles
    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_roles (
          roles (
            id,
            name,
            description
          )
        )
      `, { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get users' },
      { status: 500 }
    );
  }
}
