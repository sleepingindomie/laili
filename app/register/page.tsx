"use client";

import { useState, FC } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ChevronDown } from "lucide-react";

// --- INTERFACES ---
interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps {
  item: NavItem;
  className?: string;
}

// --- FULL NAVIGATION COMPONENT (Inner Component) ---
const FullNavigation: FC = () => {
  const pathname = usePathname();
  const [isMitraDropdownOpen, setIsMitraDropdownOpen] = useState(false);

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

  const NavLink: FC<NavLinkProps> = ({ item, className = "" }) => {
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
};


// --- REGISTER PAGE UTAMA ---
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    namaLengkap: "",
    nomorTelepon: "",
    alamat: "",
  });

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Pastikan window.location.origin ada sebelum memanggil
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat mendaftar dengan Google");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Sanitize and validate email
    const sanitizedEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      setError("Format email tidak valid. Pastikan email Anda benar.");
      setIsLoading(false);
      return;
    }

    // Validate name
    if (!formData.namaLengkap.trim()) {
      setError("Nama lengkap harus diisi");
      setIsLoading(false);
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password harus minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with email:', sanitizedEmail);

      // Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            nama_lengkap: formData.namaLengkap.trim(),
            nomor_telepon: formData.nomorTelepon.trim(),
            alamat: formData.alamat.trim(),
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes('already registered')) {
          throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        }
        throw signUpError;
      }

      if (authData.user) {
        // Wait a bit for auth trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Use UPSERT to either insert or update profile data
        // This ensures data is always saved regardless of trigger
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: sanitizedEmail,
            nama_lengkap: formData.namaLengkap.trim(),
            nomor_telepon: formData.nomorTelepon.trim(),
            alamat: formData.alamat.trim(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
          // Still continue even if profile save fails
          // User can update profile later
        }

        // Verify profile was saved
        const { data: verifyProfile } = await supabase
          .from('profiles')
          .select('nama_lengkap, email')
          .eq('id', authData.user.id)
          .single();

        console.log('Profile saved:', verifyProfile);

        // Check if email confirmation is required
        if (authData.session) {
          // User is automatically logged in (no email confirmation required)
          router.push('/mitra/beranda');
        } else {
          // Email confirmation required
          router.push('/login?message=Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--accent-warm)' }}>
      {/* Navigation Component */}
      <FullNavigation />

      {/* Register Form */}
      <div className="container-responsive py-10 sm:py-12">
        <div className="mx-auto max-w-md">
          <div className="card bg-white p-6 sm:p-8">
            <div className="mb-6 flex justify-center">
              <Logo width={100} height={32} />
            </div>
            <h2 className="mb-5 text-center text-2xl font-semibold text-gray-800">
              Daftar Akun Baru
            </h2>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="touch-target mb-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 px-6 py-3 font-medium transition-all hover:bg-gray-50 disabled:opacity-50"
              style={{ borderColor: 'var(--primary-300)', color: 'var(--primary-700)' }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Daftar dengan Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--primary-300)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4" style={{ color: 'var(--primary-600)' }}>
                  atau, daftar dengan e-mail
                </span>
              </div>
            </div>

            {/* Email registration form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="namaLengkap" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="namaLengkap"
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--primary-300)',
                      outlineColor: 'var(--accent-dark)',
                    }}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                    onBlur={(e) => setFormData({ ...formData, email: e.target.value.trim().toLowerCase() })}
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--primary-300)',
                      outlineColor: 'var(--accent-dark)',
                    }}
                    placeholder="nama@example.com"
                    autoComplete="email"
                    spellCheck="false"
                    autoCapitalize="none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nomorTelepon" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="nomorTelepon"
                    type="tel"
                    value={formData.nomorTelepon}
                    onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--primary-300)',
                      outlineColor: 'var(--accent-dark)',
                    }}
                    placeholder="08xx-xxxx-xxxx"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="alamat" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Alamat
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5" style={{ color: 'var(--primary-400)' }} />
                  <textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--primary-300)',
                      outlineColor: 'var(--accent-dark)',
                    }}
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-12 focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--primary-300)' }}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--primary-400)' }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Konfirmasi Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-12 focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--primary-300)' }}
                    placeholder="Ulangi password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--primary-400)' }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary touch-target w-full disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </button>
            </form>

            <div className="mt-5 text-center text-xs" style={{ color: 'var(--primary-600)' }}>
              <p>
                Password minimal 6 karakter, disarankan mengandung huruf dan angka
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-secondary-600 hover:text-secondary-700">
                Login di sini
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--accent-darker)' }}>
          <div className="container-responsive py-10 sm:py-12">
            <div className="mb-8 flex justify-center">
              <div className="rounded-lg bg-white p-4">
                <Logo width={120} height={38} />
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="mb-3 font-bold text-white">Laili Brand</h4>
                <p className="leading-relaxed text-gray-300">
                  Ibu Berkarir dalam rumah
                </p>
              </div>
            </div>

            <div
              className="border-t pt-5 text-center text-sm text-gray-400"
              style={{ borderColor: 'var(--primary-700)' }}
            >
              <p>&copy; 2025 Laili Brand. All rights reserved.</p>
            </div>
          </div>
      </footer>
    </div>
  );
}
