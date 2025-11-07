"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, ShoppingBag, GraduationCap, ChevronDown, LogOut, MessageCircle, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import NotificationBell from "@/components/NotificationBell";

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Nama Bunda");
  const [isAdmin, setIsAdmin] = useState(false);
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

        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role:roles(name)')
          .eq('user_id', user.id);

        const hasAdminRole = roles?.some((r: any) => r.role?.name === 'admin');
        setIsAdmin(hasAdminRole || false);
      }
    };
    getUser();
  }, [supabase]);

  const navigation = [
    { name: "Beranda", href: "/mitra/beranda", icon: Home },
    { name: "Profil", href: "/mitra/profil", icon: User },
    { name: "Katalog", href: "/mitra/katalog", icon: ShoppingBag },
    { name: "Edukasi", href: "/mitra/kelas", icon: GraduationCap },
    { name: "Chat", href: "/mitra/chat", icon: MessageCircle },
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
    <div className="min-h-screen bg-gradient-to-b from-[#f1f8ed] to-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container-responsive py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/mitra/beranda" className="flex items-center">
                <Logo width={120} height={38} />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 font-medium transition-colors ${
                        isActive
                          ? "text-[#1A4D2E] font-semibold border-b-2 border-[#1A4D2E]"
                          : "text-gray-700 hover:text-[#1A4D2E]"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Notification Bell */}
              <NotificationBell />

              {/* Info Dropdown - Desktop dengan Framer Motion */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border-2 border-[#A8C69F] bg-white px-4 py-2 font-medium text-[#1A4D2E] transition-colors hover:bg-[#f1f8ed]"
                >
                  <span>Info</span>
                  <motion.div
                    animate={{ rotate: isInfoDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isInfoDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsInfoDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                      >
                        {infoMenuItems.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsInfoDropdownOpen(false)}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#e8f5e9] hover:text-[#1A4D2E] transition-colors"
                            >
                              {item.name}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Admin Panel Link (for admins only) */}
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin</span>
                </Link>
              )}

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-[#1A4D2E] px-6 py-2 font-medium text-white transition-colors hover:bg-[#12331c] shadow-md hover:shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </motion.button>
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
                        ? "text-[#1A4D2E] font-semibold"
                        : "text-gray-600 hover:text-[#1A4D2E]"
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
                  className="flex items-center gap-1 font-medium text-gray-600 hover:text-[#1A4D2E] transition-colors"
                >
                  <span>Info</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isInfoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isInfoDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsInfoDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                      >
                        {infoMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsInfoDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e8f5e9] hover:text-[#1A4D2E] transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg bg-[#1A4D2E] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#12331c]"
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
