import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={120} height={38} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="font-medium transition-colors"
              style={{ color: 'var(--accent-dark)' }}
            >
              Beranda
            </Link>
            <Link
              href="/profil"
              className="font-medium transition-colors"
              style={{ color: 'var(--accent-dark)' }}
            >
              Profil
            </Link>
            <Link
              href="/social-media"
              className="font-medium transition-colors"
              style={{ color: 'var(--accent-dark)' }}
            >
              Social Media
            </Link>
            <Link
              href="/brand"
              className="font-medium transition-colors"
              style={{ color: 'var(--accent-dark)' }}
            >
              Brand
            </Link>
            <Link
              href="/login"
              className="btn-primary"
            >
              Login Mitra
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="touch-target md:hidden"
            aria-label="Menu"
            style={{ color: 'var(--accent-dark)' }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
