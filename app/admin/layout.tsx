'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { hasRole } from '@/lib/rbac/permissions';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const adminCheck = await hasRole('admin');
      setIsAdmin(adminCheck);

      if (!adminCheck) {
        router.push('/mitra/beranda');
      }
    } catch (error) {
      console.error('Admin access check error:', error);
      router.push('/mitra/beranda');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <nav className="flex space-x-4">
                <Link
                  href="/admin/users"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  Users
                </Link>
                <Link
                  href="/admin/roles"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  Roles
                </Link>
                <Link
                  href="/admin/permissions"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  Permissions
                </Link>
                <Link
                  href="/admin/cache"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  Cache
                </Link>
                <Link
                  href="/admin/performance"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  Performance
                </Link>
              </nav>
            </div>
            <Link
              href="/mitra/beranda"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
