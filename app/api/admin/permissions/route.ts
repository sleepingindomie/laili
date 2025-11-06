/**
 * Admin API: Permission Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/rbac/middleware';

export async function GET(request: NextRequest) {
  try {
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();

    const { data: permissions, error } = await supabase
      .from('permissions')
      .select('*')
      .order('resource')
      .order('action');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      permissions,
    });
  } catch (error: any) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get permissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const permCheck = await requireAdmin();
    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.user ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const body = await request.json();
    const { name, description, resource, action } = body;

    if (!name || !resource || !action) {
      return NextResponse.json(
        { error: 'Name, resource, and action are required' },
        { status: 400 }
      );
    }

    const { data: permission, error } = await supabase
      .from('permissions')
      .insert({ name, description, resource, action })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      permission,
      message: 'Permission created successfully',
    });
  } catch (error: any) {
    console.error('Create permission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create permission' },
      { status: 500 }
    );
  }
}
