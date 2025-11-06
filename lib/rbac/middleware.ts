/**
 * RBAC Middleware for API Routes and Server Actions
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export interface PermissionCheckResult {
  allowed: boolean;
  user: any | null;
  error?: string;
}

/**
 * Check if user has required permission
 */
export async function requirePermission(
  permissionName: string
): Promise<PermissionCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        allowed: false,
        user: null,
        error: 'Unauthorized',
      };
    }

    // Check permission using RPC function
    const { data: hasPermission, error: permError } = await supabase.rpc(
      'has_permission',
      {
        user_id: user.id,
        permission_name: permissionName,
      }
    );

    if (permError) {
      console.error('Permission check error:', permError);
      return {
        allowed: false,
        user,
        error: 'Permission check failed',
      };
    }

    if (!hasPermission) {
      return {
        allowed: false,
        user,
        error: `Permission denied: ${permissionName} required`,
      };
    }

    return {
      allowed: true,
      user,
    };
  } catch (error) {
    console.error('Permission middleware error:', error);
    return {
      allowed: false,
      user: null,
      error: 'Internal server error',
    };
  }
}

/**
 * Check if user has required role
 */
export async function requireRole(roleName: string): Promise<PermissionCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        allowed: false,
        user: null,
        error: 'Unauthorized',
      };
    }

    // Get user roles
    const { data: roles, error: roleError } = await supabase.rpc('get_user_roles', {
      user_id: user.id,
    });

    if (roleError) {
      console.error('Role check error:', roleError);
      return {
        allowed: false,
        user,
        error: 'Role check failed',
      };
    }

    const hasRole = roles?.some((role: any) => role.role_name === roleName);

    if (!hasRole) {
      return {
        allowed: false,
        user,
        error: `Role denied: ${roleName} required`,
      };
    }

    return {
      allowed: true,
      user,
    };
  } catch (error) {
    console.error('Role middleware error:', error);
    return {
      allowed: false,
      user: null,
      error: 'Internal server error',
    };
  }
}

/**
 * Check if user has ANY of the required permissions
 */
export async function requireAnyPermission(
  permissionNames: string[]
): Promise<PermissionCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        allowed: false,
        user: null,
        error: 'Unauthorized',
      };
    }

    // Check each permission
    for (const permissionName of permissionNames) {
      const { data: hasPermission } = await supabase.rpc('has_permission', {
        user_id: user.id,
        permission_name: permissionName,
      });

      if (hasPermission) {
        return {
          allowed: true,
          user,
        };
      }
    }

    return {
      allowed: false,
      user,
      error: `Permission denied: one of [${permissionNames.join(', ')}] required`,
    };
  } catch (error) {
    console.error('Permission middleware error:', error);
    return {
      allowed: false,
      user: null,
      error: 'Internal server error',
    };
  }
}

/**
 * Check if user has ALL of the required permissions
 */
export async function requireAllPermissions(
  permissionNames: string[]
): Promise<PermissionCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        allowed: false,
        user: null,
        error: 'Unauthorized',
      };
    }

    // Check all permissions
    for (const permissionName of permissionNames) {
      const { data: hasPermission } = await supabase.rpc('has_permission', {
        user_id: user.id,
        permission_name: permissionName,
      });

      if (!hasPermission) {
        return {
          allowed: false,
          user,
          error: `Permission denied: ${permissionName} required`,
        };
      }
    }

    return {
      allowed: true,
      user,
    };
  } catch (error) {
    console.error('Permission middleware error:', error);
    return {
      allowed: false,
      user: null,
      error: 'Internal server error',
    };
  }
}

/**
 * Middleware wrapper for API routes
 */
export function withPermission(permissionName: string) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, user: any) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const result = await requirePermission(permissionName);

    if (!result.allowed) {
      return NextResponse.json(
        { error: result.error || 'Permission denied' },
        { status: result.user ? 403 : 401 }
      );
    }

    return handler(request, result.user);
  };
}

/**
 * Middleware wrapper for role-based access
 */
export function withRole(roleName: string) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, user: any) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const result = await requireRole(roleName);

    if (!result.allowed) {
      return NextResponse.json(
        { error: result.error || 'Access denied' },
        { status: result.user ? 403 : 401 }
      );
    }

    return handler(request, result.user);
  };
}

/**
 * Check if user is admin
 */
export async function requireAdmin(): Promise<PermissionCheckResult> {
  return requireRole('admin');
}

/**
 * Middleware for admin-only routes
 */
export function withAdmin() {
  return withRole('admin');
}
