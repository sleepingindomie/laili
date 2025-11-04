import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter, MessageCircle } from "lucide-react";

export default function SocialMediaPage() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@lailibrand",
      url: "#",
      icon: Instagram,
      color: "from-pink-500 to-purple-500",
      description: "Follow untuk update produk dan tips bisnis terbaru"
    },
    {
      name: "Facebook",
      handle: "Laili Brand Official",
      url: "#",
      icon: Facebook,
      color: "from-blue-600 to-blue-700",
      description: "Join komunitas mitra Laili di Facebook"
    },
    {
      name: "WhatsApp",
      handle: "+62 812-xxxx-xxxx",
      url: "#",
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      description: "Hubungi kami untuk informasi lebih lanjut"
    },
    {
      name: "YouTube",
      handle: "Laili Brand",
      url: "#",
      icon: Youtube,
      color: "from-red-600 to-red-700",
      description: "Tonton video tutorial dan testimoni mitra"
    },
    {
      name: "Twitter/X",
      handle: "@lailibrand",
      url: "#",
      icon: Twitter,
      color: "from-gray-700 to-gray-900",
      description: "Follow untuk berita dan announcement terkini"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">Laili</span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-gray-600 transition-colors hover:text-gray-900">
                Beranda
              </Link>
              <Link href="/profil" className="text-gray-600 transition-colors hover:text-gray-900">
                Profil
              </Link>
              <Link href="/social-media" className="font-semibold text-gray-900">
                Social Media
              </Link>
              <Link href="/brand" className="text-gray-600 transition-colors hover:text-gray-900">
                Brand
              </Link>
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

      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
              Terhubung dengan Kami
            </h1>
            <p className="text-lg text-gray-600">
              Follow social media kami untuk update terbaru, tips bisnis, dan inspirasi dari komunitas mitra Laili
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:shadow-lg"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                    <div className="relative">
                      <div className={`mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br ${social.color} p-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-2 text-2xl font-bold text-gray-900">{social.name}</h3>
                      <p className="mb-4 text-lg font-medium text-gray-700">{social.handle}</p>
                      <p className="text-sm text-gray-600">{social.description}</p>
                      <div className="mt-6 flex items-center text-sm font-semibold text-gray-900">
                        <span>Kunjungi</span>
                        <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Newsletter Section */}
            <div className="mt-16 rounded-2xl bg-gray-900 p-8 text-center text-white sm:p-12">
              <h2 className="mb-4 text-3xl font-bold">Dapatkan Update Terbaru</h2>
              <p className="mb-8 text-gray-300">
                Subscribe newsletter kami untuk mendapatkan tips bisnis, update produk, dan penawaran eksklusif
              </p>
              <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 rounded-lg border-0 px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="touch-target rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container-responsive py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Laili Brand</h4>
              <p className="text-sm text-gray-600">Platform kemitraan terpercaya</p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Informasi</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/profil" className="text-gray-600 hover:text-gray-900">Tentang</Link></li>
                <li><Link href="/brand" className="text-gray-600 hover:text-gray-900">Brand</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">info@laili.com</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Ikuti Kami</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">📱</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">💬</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Laili Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
