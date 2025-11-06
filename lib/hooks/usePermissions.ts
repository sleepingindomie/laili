import { useEffect, useState } from 'react';
import {
  getUserPermissions,
  getUserRoles,
  hasPermission as checkPermission,
  Permission,
  Role,
} from '@/lib/rbac/permissions';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      try {
        const [perms, userRoles] = await Promise.all([
          getUserPermissions(),
          getUserRoles(),
        ]);
        setPermissions(perms);
        setRoles(userRoles);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  const hasPermission = (permissionName: string): boolean => {
    return permissions.some((p) => p.name === permissionName);
  };

  const hasRole = (roleName: string): boolean => {
    return roles.some((r) => r.name === roleName);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const canAccess = (resource: string, action: string): boolean => {
    return permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  };

  return {
    permissions,
    roles,
    loading,
    hasPermission,
    hasRole,
    isAdmin,
    canAccess,
  };
}
