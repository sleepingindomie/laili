// components/Navigation.tsx
"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

// --- INTERFACES ---
interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps {
  item: NavItem;
  className?: string;
}

// --- SUB-KOMPONEN ---

// Komponen Tautan Navigasi Reusable dengan Framer Motion
const NavLink: FC<NavLinkProps> = ({ item, className = "" }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={item.href}
        className={`font-medium transition-colors ${
          isActive ? "text-[#1A4D2E] font-semibold border-b-2 border-[#1A4D2E]" : "text-gray-700 hover:text-[#1A4D2E]"
        } ${className}`}
      >
        {item.name}
      </Link>
    </motion.div>
  );
};

// --- KOMPONEN UTAMA NAVIGATION ---
export default function Navigation() {
  const [isMitraDropdownOpen, setIsMitraDropdownOpen] = useState(false);

  // Data Navigasi
  const navigation: NavItem[] = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Social Media", href: "/social-media" },
    { name: "Brand", href: "/brand" },
  ];

  const supplierMenuItems: NavItem[] = [
    { name: "Testimoni Partner", href: "/login" },
    { name: "Edukasi & Pelatihan", href: "/login" },
    { name: "Video Konten", href: "/login" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-responsive py-4">
        {/* Layout Desktop: Horizontal */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center">
            <Logo width={120} height={38} />
          </Link>

          {/* Navigasi Desktop */}
          <div className="flex items-center gap-6">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {/* Dropdown Supplier/Klien Desktop dengan Framer Motion */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border-2 border-[#1A4D2E] bg-white px-4 py-2 font-medium text-[#1A4D2E] hover:bg-[#e8f5e9] transition-colors"
              >
                <span>Supplier/Klien</span>
                <motion.div
                  animate={{ rotate: isMitraDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isMitraDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsMitraDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                      {supplierMenuItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMitraDropdownOpen(false)}
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

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="rounded-lg bg-[#1A4D2E] px-6 py-2 text-white transition-colors hover:bg-[#12331c] shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Layout Mobile: Vertical - Semua menu ditampilkan tanpa hamburger */}
        <div className="md:hidden">
          {/* Logo di atas */}
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Logo width={100} height={32} />
            </Link>
          </div>

          {/* Menu navigasi vertikal */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {/* Dropdown Supplier/Klien Mobile */}
            <div className="relative">
              <button
                onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-[#1A4D2E] transition-colors"
              >
                <span>Supplier/Klien</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isMitraDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMitraDropdownOpen && (
                  <>
                    {/* Backdrop untuk mobile */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsMitraDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      {supplierMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMitraDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e8f5e9] hover:text-[#1A4D2E] rounded-md"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/login"
              className="rounded-lg bg-[#1A4D2E] px-4 py-1.5 text-white transition-colors hover:bg-[#12331c]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
