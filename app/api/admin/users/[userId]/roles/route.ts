/**
 * Admin API: Assign/Remove User Roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/rbac/middleware';

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const { userId } = await params;

    const { data: roles, error } = await supabase.rpc('get_user_roles', {
      user_id: userId,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      roles,
    });
  } catch (error: any) {
    console.error('Get user roles error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get user roles' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const { userId } = await params;
    const body = await request.json();
    const { roleId } = body;

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Assign role to user
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Role assigned successfully',
    });
  } catch (error: any) {
    console.error('Assign role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const roleId = searchParams.get('roleId');

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Remove role from user
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Role removed successfully',
    });
  } catch (error: any) {
    console.error('Remove role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove role' },
      { status: 500 }
    );
  }
}
