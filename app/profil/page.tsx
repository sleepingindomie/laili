"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Rocket, CheckCircle2, Award, TrendingUp, Users, Leaf, ShieldCheck } from "lucide-react";

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f8ed] to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#A8C69F]/20 bg-gradient-to-br from-[#1A4D2E] to-[#12331c] py-20">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#A8C69F]/10 blur-3xl"
          />
        </div>

        <div className="container-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 inline-flex rounded-full bg-[#B8873B] p-4 shadow-2xl"
            >
              <Target className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold !text-white sm:text-5xl">
              Tentang PT. Toma Organik Solusi
            </h1>
            <p className="text-xl text-gray-200">
              Agregator & Distributor Bahan Baku Organik B2B Terpercaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#1A4D2E]/10 sm:p-12">
              <h2 className="mb-6 text-center text-3xl font-bold text-[#1A4D2E]">
                Menghubungkan Petani dengan Sektor Komersial
              </h2>
              <p className="text-center text-lg leading-relaxed text-gray-700">
                Kami adalah platform B2B yang menghubungkan <strong>petani organik bersertifikat</strong> dengan
                sektor komersial seperti HORECA (Hotel, Restaurant, Café), pabrik pengolahan, dan ritel khusus.
                Dengan teknologi digital dan rantai pasok yang transparan, kami memastikan setiap produk dapat
                ditelusuri dari <span className="text-[#1A4D2E] font-semibold">ladang hingga meja pelanggan Anda</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visi & Misi dengan Flip Cards */}
      <section className="py-16">
        <div className="container-responsive">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-[#1A4D2E] sm:text-4xl"
          >
            Visi & Misi Kami
          </motion.h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Visi Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, rotateY: 5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A4D2E] to-[#12331c] p-10 shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="mb-6">
                <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Visi</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-200">
                Menjadi platform agregator bahan baku organik <strong className="text-[#A8C69F]">terdepan di Indonesia</strong> yang
                menghubungkan petani bersertifikat dengan sektor komersial melalui rantai pasok yang transparan dan berkelanjutan.
              </p>

              <motion.div
                className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-[#A8C69F]/20 blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>

            {/* Misi Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, rotateY: -5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B4513] to-[#B8873B] p-10 shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="mb-6">
                <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Misi</h3>
              </div>
              <div className="space-y-3 text-gray-100">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <span>Menyediakan akses mudah ke bahan baku organik berkualitas tinggi</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <span>Membangun transparansi penuh dalam rantai pasok dari petani hingga klien</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <span>Mendukung pertumbuhan ekonomi petani organik lokal</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                  <span>Meningkatkan efisiensi operasional pengadaan B2B</span>
                </p>
              </div>

              <motion.div
                className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Nilai Inti dengan Icon Animation */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-center text-3xl font-bold text-[#1A4D2E] sm:text-4xl"
          >
            4 Nilai Inti Toma
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center text-lg text-gray-600"
          >
            Prinsip yang memandu setiap keputusan dan tindakan kami
          </motion.p>

          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Kualitas",
                desc: "Sertifikasi organik terverifikasi untuk semua produk",
                icon: Award,
                gradient: "from-[#1A4D2E] to-[#A8C69F]"
              },
              {
                title: "Transparansi",
                desc: "Ketertelusuran penuh dari petani hingga pelanggan",
                icon: ShieldCheck,
                gradient: "from-[#A8C69F] to-[#8B4513]"
              },
              {
                title: "Keberlanjutan",
                desc: "Praktik pertanian ramah lingkungan & berkelanjutan",
                icon: Leaf,
                gradient: "from-[#8B4513] to-[#B8873B]"
              },
              {
                title: "Keandalan",
                desc: "Pasokan konsisten & pengiriman tepat waktu",
                icon: TrendingUp,
                gradient: "from-[#B8873B] to-[#1A4D2E]"
              }
            ].map((nilai, index) => {
              const IconComponent = nilai.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#f1f8ed] p-8 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${nilai.gradient} p-4 shadow-md`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="mb-3 text-2xl font-bold text-[#1A4D2E]">{nilai.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{nilai.desc}</p>

                  {/* Hover effect background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${nilai.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 Benefit Bergabung */}
      <section className="py-16">
        <div className="container-responsive">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-[#1A4D2E] sm:text-4xl"
          >
            5 Keuntungan Bergabung dengan Toma
          </motion.h2>

          <div className="mx-auto max-w-4xl space-y-6">
            {[
              {
                title: "Akses ke Jaringan Petani Organik Bersertifikat",
                desc: "Terhubung langsung dengan ratusan petani organik yang telah terverifikasi dan tersertifikasi"
              },
              {
                title: "Jaminan Kualitas & Konsistensi Produk",
                desc: "Quality control ketat di setiap tahap untuk memastikan standar organik terpenuhi"
              },
              {
                title: "Transparansi Harga & Rantai Pasok",
                desc: "Sistem pricing yang jelas dan ketertelusuran lengkap menggunakan teknologi blockchain"
              },
              {
                title: "Sistem Order & Tracking Terintegrasi",
                desc: "Platform digital yang memudahkan pemesanan, pembayaran, dan pelacakan pengiriman real-time"
              },
              {
                title: "Dukungan Edukasi Pertanian Organik",
                desc: "Akses ke pelatihan, sertifikasi, dan best practices untuk meningkatkan produktivitas"
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex gap-6 rounded-2xl border-2 border-[#A8C69F]/30 bg-white p-6 shadow-md transition-all hover:border-[#1A4D2E] hover:shadow-xl"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A4D2E] to-[#A8C69F] shadow-lg"
                >
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </motion.div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-[#1A4D2E]">{benefit.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 overflow-hidden">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A4D2E] via-[#12331c] to-[#0e2615] p-10 text-center shadow-2xl sm:p-16">
              {/* Decorative Elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#A8C69F]/10 blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#B8873B]/10 blur-3xl"
              />

              <div className="relative z-10">
                <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                  Siap Bergabung dengan Ekosistem Organik Toma?
                </h2>
                <p className="mb-8 text-xl leading-relaxed text-gray-200">
                  Mulai perjalanan bisnis organik berkelanjutan Anda bersama kami hari ini
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="inline-block rounded-xl bg-gradient-to-r from-[#B8873B] to-[#8B4513] px-10 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-[0_20px_60px_rgba(184,135,59,0.4)]"
                  >
                    Daftar Sekarang - Gratis
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
