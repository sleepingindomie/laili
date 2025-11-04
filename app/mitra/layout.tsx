"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, ShoppingBag, GraduationCap, ChevronDown, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Nama Bunda");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('nama_lengkap')
          .eq('id', user.id)
          .single();

        if (userData?.nama_lengkap) {
          setUserName(userData.nama_lengkap);
        }
      }
    };
    getUser();
  }, [supabase]);

  const navigation = [
    { name: "Beranda", href: "/mitra/beranda", icon: Home },
    { name: "Profil", href: "/mitra/profil", icon: User },
    { name: "Katalog", href: "/mitra/katalog", icon: ShoppingBag },
    { name: "Kelas", href: "/mitra/kelas", icon: GraduationCap },
  ];

  const infoMenuItems = [
    { name: "Total Penjualan", href: "/mitra/total-penjualan" },
    { name: "Tagihan", href: "/mitra/tagihan" },
    { name: "Order", href: "/mitra/order" },
    { name: "Poin", href: "/mitra/poin" },
    { name: "Hadiah", href: "/mitra/hadiah" },
    { name: "Pengingat", href: "/mitra/pengingat" },
    { name: "Update Resi", href: "/mitra/update-resi" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container-responsive py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between">
            {/* Logo */}
            <Link href="/mitra/beranda" className="flex items-center">
              <Logo width={120} height={38} />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      isActive
                        ? "text-secondary-600 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Info Dropdown - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span>Info</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isInfoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isInfoDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsInfoDropdownOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      {infoMenuItems.map((item, index) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsInfoDropdownOpen(false)}
                          className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 ${
                            index === 0 ? 'rounded-t-lg' : ''
                          } ${index === infoMenuItems.length - 1 ? 'rounded-b-lg' : ''}`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Mobile Layout - Semua menu ditampilkan tanpa hamburger */}
          <div className="md:hidden">
            {/* Logo di tengah */}
            <div className="flex justify-center mb-4">
              <Link href="/mitra/beranda">
                <Logo width={100} height={32} />
              </Link>
            </div>

            {/* Menu navigasi mobile - wrapped flex */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 font-medium transition-colors ${
                      isActive
                        ? "text-secondary-600 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Info Dropdown - Mobile Inline */}
              <div className="relative">
                <button
                  onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                  className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>Info</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isInfoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isInfoDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsInfoDropdownOpen(false)}
                    />
                    <div className="absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      {infoMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsInfoDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
              >
                <LogOut className="h-3 w-3" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom padding for mobile - tidak perlu bottom navigation lagi */}
      <div className="h-6 md:hidden" />
    </div>
  );
}
