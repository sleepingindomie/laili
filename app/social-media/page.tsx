import Link from "next/link";
import { Instagram, Youtube, Twitter, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";

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
      <Navigation />

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
          </div>
        </div>
      </section>

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
