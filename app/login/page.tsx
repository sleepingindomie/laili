"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/mitra/beranda");
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat login dengan Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--accent-warm)' }}>
      {/* Navigation */}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container-responsive py-10 sm:py-12">
        <div className="mx-auto max-w-md">
          <div className="card bg-white p-6 sm:p-8">
            <div className="mb-6 flex justify-center">
              <Logo width={100} height={32} />
            </div>
            <h2 className="mb-5 text-center text-2xl font-semibold text-gray-800">
              Masuk ke Akun Anda
            </h2>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
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
              <span>Masuk dengan Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--primary-300)' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4" style={{ color: 'var(--primary-600)' }}>
                  atau, masuk dengan e-mail
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--primary-300)',
                      outlineColor: 'var(--accent-dark)',
                    }}
                    placeholder="nama@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block font-medium" style={{ color: 'var(--primary-700)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--primary-400)' }} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="touch-target w-full rounded-lg border py-3 pl-10 pr-12 focus:outline-none focus:ring-2"
                    style={{ borderColor: 'var(--primary-300)' }}
                    placeholder="Masukkan password"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    style={{ borderColor: 'var(--primary-300)' }}
                  />
                  <span style={{ color: 'var(--primary-600)' }}>Ingat saya</span>
                </label>
                <Link
                  href="/lupa-password"
                  className="transition-colors"
                  style={{ color: 'var(--accent-dark)' }}
                >
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary touch-target w-full disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <div className="mt-5 text-center text-xs" style={{ color: 'var(--primary-600)' }}>
              <p>
                Password minimal 8 karakter, mengandung huruf kapital dan kecil, serta angka
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-secondary-600 hover:text-secondary-700">
                Daftar di sini
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

          <div className="mb-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="mb-3 font-bold text-white">Laili Brand</h4>
              <p className="leading-relaxed text-gray-300">
                Ibu rumah tangga berdaya & berkarir dari rumah
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-bold text-white">Informasi</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/profil" className="text-gray-300 transition-colors hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/brand" className="text-gray-300 transition-colors hover:text-white">
                    Brand
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-bold text-white">Kontak</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Email: info@laili.com</li>
                <li className="text-gray-300">WhatsApp: 0812-xxxx-xxxx</li>
              </ul>
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
