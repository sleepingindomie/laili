import { createClient } from '@/lib/supabase/client';

export interface Permission {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  name: string;
  description?: string;
}

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permissionName: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase.rpc('has_permission', {
      user_id: user.id,
      permission_name: permissionName,
    });

    if (error) {
      console.error('Permission check error:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

/**
 * Get all roles for current user
 */
export async function getUserRoles(): Promise<Role[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase.rpc('get_user_roles', {
      user_id: user.id,
    });

    if (error) {
      console.error('Get roles error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get roles error:', error);
    return [];
  }
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<Permission[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase.rpc('get_user_permissions', {
      user_id: user.id,
    });

    if (error) {
      console.error('Get permissions error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get permissions error:', error);
    return [];
  }
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(permissionNames: string[]): Promise<boolean> {
  const results = await Promise.all(
    permissionNames.map((name) => hasPermission(name))
  );
  return results.some((result) => result === true);
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(permissionNames: string[]): Promise<boolean> {
  const results = await Promise.all(
    permissionNames.map((name) => hasPermission(name))
  );
  return results.every((result) => result === true);
}

/**
 * Check if user has a specific role
 */
export async function hasRole(roleName: string): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.some((role) => role.name === roleName);
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}
