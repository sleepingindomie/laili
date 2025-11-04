// components/Navigation.tsx
"use client";

import { useState, useCallback, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

// 1. DEFINISI INTERFACE UNTUK TIPE DATA NAVIGASI
// Ini menentukan struktur yang harus dimiliki oleh setiap item navigasi.
interface NavItem {
  name: string;
  href: string;
}

// 2. DEFINISI INTERFACE UNTUK PROPS KOMPONEN NavLink
interface NavLinkProps {
  item: NavItem;
  isMobile?: boolean;
}

// 3. KOMPONEN TAUTAN NAVIGASI REUSABLE
// Tipe data NavLinkProps diterapkan di sini.
const NavLink: FC<NavLinkProps> = ({ item, isMobile = false }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  const baseClasses = "font-medium transition-colors";
  
  // Kelas tampilan Desktop
  const desktopClasses = `${baseClasses} ${
    isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"
  }`;
  
  // Kelas tampilan Mobile
  const mobileClasses = `block px-4 py-2 rounded-md ${
    isActive ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
  }`;

  return (
    <Link
      key={item.name}
      href={item.href}
      // Di Mobile, kami ingin menu tertutup setelah klik
      onClick={isMobile ? () => document.dispatchEvent(new Event('close-all-menus')) : undefined}
      className={isMobile ? mobileClasses : desktopClasses}
    >
      {item.name}
    </Link>
  );
};

// 4. KOMPONEN UTAMA NAVIGATION
export default function Navigation() {
  const pathname = usePathname();
  
  // State untuk menu Desktop/Mitra
  const [isMitraDropdownOpen, setIsMitraDropdownOpen] = useState(false);
  // State untuk menu Mobile (Hamburger)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // Fungsi utilitas untuk menutup semua menu
  const closeAllMenus = useCallback(() => {
    setIsMitraDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  // Efek untuk menangani event global penutup menu (dari NavLink)
  // Ini adalah cara yang lebih baik daripada passing prop terlalu dalam.
  useState(() => {
    const handleClose = () => closeAllMenus();
    document.addEventListener('close-all-menus', handleClose);
    return () => document.removeEventListener('close-all-menus', handleClose);
  });
  
  // Terapkan NavItem[] pada array navigasi
  const navigation: NavItem[] = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Social Media", href: "/social-media" },
    { name: "Brand", href: "/brand" },
  ];

  // Terapkan NavItem[] pada array menu Mitra
  const mitraMenuItems: NavItem[] = [
    { name: "Testimoni Mitra", href: "/login" },
    { name: "Kelas Online", href: "/login" },
    { name: "Video Konten", href: "/login" },
  ];

  // Komponen Dropdown Mitra Reusable
  const MitraDropdown: FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <div className={isMobile ? "" : "relative"}>
      <button
        onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
        className={`flex items-center justify-between gap-2 transition-colors ${
            isMobile 
                ? 'w-full px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50'
                : 'rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span>Mitra</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isMitraDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isMitraDropdownOpen && (
        <>
          {/* Backdrop hanya untuk desktop */}
          {!isMobile && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMitraDropdownOpen(false)}
            />
          )}

          <div 
            className={`${isMobile ? 'flex flex-col space-y-1 pl-4 mt-1' : 'absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'}`}
          >
            {mitraMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeAllMenus}
                className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center">
            <Logo width={120} height={38} />
          </Link>

          {/* Tombol Hamburger (Mobile Only) */}
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* 1. Navigasi Desktop (Hidden di Mobile) */}
          <div className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            <MitraDropdown isMobile={false} />

            <Link
              href="/login"
              className="touch-target rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Menu Mobile Drawer (Hidden di Desktop) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4 border-t border-gray-100">
          <div className="flex flex-col space-y-1 px-4 pt-3">
            
            {/* Tautan Navigasi Mobile */}
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} isMobile={true} />
            ))}

            {/* Dropdown Mitra Mobile */}
            <div className="py-1"> 
                <MitraDropdown isMobile={true} />
            </div>

            {/* Tombol Login Mobile */}
            <Link
              href="/login"
              onClick={closeAllMenus}
              className="touch-target text-center mt-2 rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}