"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingBag, GraduationCap, Menu, X, ChevronDown } from "lucide-react";

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Top Navigation - Desktop & Mobile */}
      <nav className="sticky top-0 z-50 bg-secondary-500 shadow-md">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Partner Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <span className="text-xl font-bold text-secondary-500">M</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">Nama Bunda</p>
                <p className="text-xs text-secondary-100">Mitra Laili</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 md:flex">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-secondary-100 hover:text-white"
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
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
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
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white shadow-lg">
                      {infoMenuItems.map((item, index) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsInfoDropdownOpen(false)}
                          className={`block px-4 py-3 text-gray-700 hover:bg-secondary-50 ${
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
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="touch-target text-white md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-secondary-400 bg-secondary-500 md:hidden">
            <div className="container-responsive py-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex touch-target items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                        isActive
                          ? "bg-white/20 text-white font-semibold"
                          : "text-secondary-100 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Info Dropdown - Mobile */}
                <div className="border-t border-secondary-400 pt-2">
                  <button
                    onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                    className="flex w-full touch-target items-center justify-between rounded-lg px-4 py-3 text-secondary-100 hover:bg-white/10 hover:text-white"
                  >
                    <span>Info</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isInfoDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isInfoDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {infoMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => {
                            setIsInfoDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="block touch-target rounded-lg px-4 py-3 text-sm text-secondary-100 hover:bg-white/10 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
        <div className="grid grid-cols-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex touch-target flex-col items-center justify-center gap-1 py-3 transition-colors ${
                  isActive
                    ? "text-secondary-500"
                    : "text-gray-400"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
