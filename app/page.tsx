import Link from "next/link";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--accent-warm)' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="container-responsive py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center">
            <div className="rounded-xl bg-white p-4 shadow-lg">
              <Logo width={140} height={46} priority />
            </div>
          </div>

          <div className="text-center">
            <h1 className="mb-5 text-balance">
              Selamat Datang di <br className="sm:hidden" />
              <span style={{ color: 'var(--accent-darker)' }}>Laili Brand</span>
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-balance leading-relaxed"
              style={{ color: 'var(--primary-700)' }}
            >
              Dunianya wanita berkarir dari rumah
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="btn-primary touch-target text-center"
              >
                Masuk sebagai Mitra
              </Link>
              <Link
                href="/profil"
                className="btn-outline touch-target text-center"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-responsive">
          <h2 className="mb-3 text-center text-balance">
            Fasilitas untuk Mitra
          </h2>
          <p
            className="mx-auto mb-10 max-w-2xl text-center leading-relaxed"
            style={{ color: 'var(--primary-600)' }}
          >
            Semua yang Anda butuhkan untuk sukses dalam satu platform
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Kelas Online",
                description: "Akses video pembelajaran dan coaching dari pendamping profesional untuk meningkatkan skill Anda",
                icon: "📚",
                color: "#f5f5f5"
              },
              {
                title: "Katalog Produk",
                description: "Lihat dan order produk dengan mudah langsung dari aplikasi, kapan saja dan dimana saja",
                icon: "🛍️",
                color: "#fafafa"
              },
              {
                title: "Laporan Penjualan",
                description: "Pantau total penjualan dan pencapaian Anda secara real-time dengan dashboard yang mudah dipahami",
                icon: "📊",
                color: "#f5f5f5"
              },
              {
                title: "Sistem Poin",
                description: "Kumpulkan poin dari setiap transaksi dan tukarkan dengan hadiah menarik",
                icon: "⭐",
                color: "#fafafa"
              },
              {
                title: "Pengingat Otomatis",
                description: "Dapatkan notifikasi untuk jadwal coaching, promo, dan update penting lainnya",
                icon: "🔔",
                color: "#f5f5f5"
              },
              {
                title: "Update Resi",
                description: "Kelola dan update status pengiriman dengan mudah, customer Anda pun senang",
                icon: "📦",
                color: "#fafafa"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card group cursor-pointer"
                style={{ backgroundColor: feature.color }}
              >
                <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--primary-700)' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16"
        style={{ background: 'var(--accent-cream)' }}
      >
        <div className="container-responsive">
          <div
            className="mx-auto max-w-2xl rounded-xl p-8 text-center sm:p-10"
            style={{
              backgroundColor: 'var(--accent-darker)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <h2 className="mb-4 text-white">
              Siap Bergabung dengan Laili?
            </h2>
            <p className="mb-6 leading-relaxed text-gray-300">
              Mulai perjalanan bisnis Anda bersama kami dan raih kesuksesan yang Anda impikan
            </p>
            <Link
              href="/login"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold transition-all hover:scale-105"
              style={{
                color: 'var(--accent-darker)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              Daftar Sekarang
            </Link>
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
