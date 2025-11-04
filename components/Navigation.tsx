// components/Navigation.tsx
"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
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

// Komponen Tautan Navigasi Reusable
const NavLink: FC<NavLinkProps> = ({ item, className = "" }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`font-medium transition-colors ${
        isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"
      } ${className}`}
    >
      {item.name}
    </Link>
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

  const mitraMenuItems: NavItem[] = [
    { name: "Testimoni Mitra", href: "/login" },
    { name: "Kelas Online", href: "/login" },
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

            {/* Dropdown Mitra Desktop */}
            <div className="relative">
              <button
                onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Mitra</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMitraDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMitraDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMitraDropdownOpen(false)}
                  />

                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    {mitraMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMitraDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Login
            </Link>
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

            {/* Dropdown Mitra Mobile - Inline */}
            <div className="relative">
              <button
                onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
                className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>Mitra</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isMitraDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMitraDropdownOpen && (
                <>
                  {/* Backdrop untuk mobile */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMitraDropdownOpen(false)}
                  />

                  <div className="absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    {mitraMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMitraDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-4 py-1.5 text-white transition-colors hover:bg-gray-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
