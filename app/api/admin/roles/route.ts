/**
 * Admin API: Role Management
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

    // Get all roles with their permissions
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions (
          permissions (
            id,
            name,
            description,
            resource,
            action
          )
        )
      `)
      .order('name');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      roles,
    });
  } catch (error: any) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get roles' },
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    const { data: role, error } = await supabase
      .from('roles')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      role,
      message: 'Role created successfully',
    });
  } catch (error: any) {
    console.error('Create role error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
      { status: 500 }
    );
  }
}
