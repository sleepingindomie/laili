"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";

export default function Navigation() {
  const [isMitraDropdownOpen, setIsMitraDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Social Media", href: "/social-media" },
    { name: "Brand", href: "/brand" },
  ];

  const mitraMenuItems = [
    { name: "Testimoni Mitra", href: "/login" },
    { name: "Kelas Online", href: "/login" },
    { name: "Video Konten", href: "/login" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={120} height={38} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mitra Dropdown - Desktop */}
            <div className="relative">
              <button
                onClick={() => setIsMitraDropdownOpen(!isMitraDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span>Mitra</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMitraDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMitraDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMitraDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    {mitraMenuItems.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMitraDropdownOpen(false)}
                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${index === mitraMenuItems.length - 1 ? 'rounded-b-lg' : ''}`}
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
              className="touch-target rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
