import Link from "next/link";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";

export default function ProfilPage() {
  return (
        <div className="min-h-screen" style={{ background: 'var(--accent-warm)' }}>
              <Navigation />

      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
              Tentang Laili Brand
            </h1>
            <p className="text-lg text-gray-600">
              Ibu rumah tangga berdaya & berkarir dari rumah
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-4xl">
            {/* Visi & Misi */}
            <div className="mb-16">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">Visi & Misi</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-8">
                  <h3 className="mb-4 text-2xl font-semibold text-gray-900">Visi</h3>
                  <p className="text-gray-600">
                    Menjadi platform kemitraan terdepan yang memberdayakan para mitra untuk mencapai
                    kesuksesan bersama melalui produk berkualitas dan sistem pendampingan yang terpadu.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-8">
                  <h3 className="mb-4 text-2xl font-semibold text-gray-900">Misi</h3>
                  <p className="text-gray-600">
                    Memberikan produk berkualitas, pelatihan berkelanjutan, dan sistem dukungan
                    yang komprehensif untuk memastikan kesuksesan setiap mitra Laili.
                  </p>
                </div>
              </div>
            </div>

            {/* Nilai-Nilai */}
            <div className="mb-16">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">Nilai-Nilai Kami</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Integritas", desc: "Menjunjung tinggi kejujuran dalam setiap aspek bisnis" },
                  { title: "Kualitas", desc: "Komitmen terhadap produk dan layanan terbaik" },
                  { title: "Kolaborasi", desc: "Membangun kemitraan yang saling menguntungkan" },
                  { title: "Inovasi", desc: "Terus berkembang dengan solusi kreatif" },
                  { title: "Pemberdayaan", desc: "Mendukung pertumbuhan setiap mitra" },
                  { title: "Kepercayaan", desc: "Membangun hubungan jangka panjang yang solid" },
                ].map((value, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keunggulan */}
            <div className="mb-16">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">Mengapa Bergabung dengan Laili?</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Produk Berkualitas",
                    desc: "Produk pilihan dengan standar kualitas tinggi yang telah terpercaya"
                  },
                  {
                    title: "Sistem Pendampingan",
                    desc: "Coaching dan mentoring berkelanjutan dari tim profesional"
                  },
                  {
                    title: "Fleksibilitas Waktu",
                    desc: "Jalankan bisnis dengan waktu yang fleksibel sesuai keinginan Anda"
                  },
                  {
                    title: "Komunitas Solid",
                    desc: "Bergabung dengan komunitas mitra yang saling mendukung"
                  },
                  {
                    title: "Teknologi Terkini",
                    desc: "Platform digital yang memudahkan pengelolaan bisnis Anda"
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4 rounded-lg border border-gray-200 p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                      <span className="text-xl font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-gray-900 p-8 text-center text-white sm:p-12">
              <h2 className="mb-4 text-3xl font-bold">Siap Bergabung?</h2>
              <p className="mb-8 text-gray-300">
                Mulai perjalanan kesuksesan Anda bersama Laili Brand hari ini
              </p>
              <Link
                href="/login"
                className="inline-block touch-target rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                Daftar Sekarang
              </Link>
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
