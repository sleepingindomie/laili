"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Award, CheckCircle, Leaf, Shield, Truck, Users2 } from "lucide-react";

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f8ed] to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A4D2E] to-[#12331c] py-20">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#A8C69F]/10 blur-3xl"
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
              <Leaf className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Toma Brand Identity
            </h1>
            <p className="text-xl text-gray-200">
              Agregator Bahan Baku Organik dengan Standar Kualitas Profesional B2B
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
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
                Tentang PT. Toma Organik Solusi
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  <strong className="text-[#1A4D2E]">Toma</strong> adalah platform agregator dan distributor bahan baku organik B2B
                  yang menghubungkan petani organik bersertifikat dengan sektor komersial seperti{" "}
                  <span className="font-semibold">HORECA</span> (Hotel, Restaurant, Café),{" "}
                  <span className="font-semibold">pabrik pengolahan</span>, dan{" "}
                  <span className="font-semibold">ritel khusus</span>.
                </p>
                <p>
                  Dengan teknologi digital dan sistem ketertelusuran berbasis blockchain, kami menciptakan{" "}
                  <strong className="text-[#8B4513]">rantai pasok yang transparan</strong>, memastikan setiap produk dapat
                  dilacak dari ladang hingga dapur pelanggan Anda.
                </p>
                <p className="text-center italic text-[#1A4D2E]">
                  "Bahan Baku Organik Terbaik, Kunci Kepercayaan Pelanggan Anda"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Values Grid */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-[#1A4D2E] sm:text-4xl"
          >
            Brand Identity Toma
          </motion.h2>

          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
            {[
              {
                title: "Moodboard: Professional & Trusted",
                desc: "Desain yang memancarkan kepercayaan, profesionalitas, kesegaran, dan komitmen terhadap keberlanjutan",
                icon: Award,
                gradient: "from-[#1A4D2E] to-[#A8C69F]",
                points: ["Profesional B2B", "Terpercaya", "Fresh & Natural", "Sustainable"]
              },
              {
                title: "Color Palette Organik",
                desc: "Palet warna yang mencerminkan nilai organik, alam, dan kehangatan",
                icon: Leaf,
                gradient: "from-[#A8C69F] to-[#8B4513]",
                points: ["Hijau Tua: Branding Utama", "Sage Green: Kesegaran", "Cokelat Tanah: Ketertelusuran", "Copper/Gold: Premium Touch"]
              }
            ].map((brand, index) => {
              const IconComponent = brand.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="rounded-3xl bg-gradient-to-br from-white to-[#f1f8ed] p-8 shadow-xl ring-1 ring-[#1A4D2E]/10"
                >
                  <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${brand.gradient} p-4 shadow-lg`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-[#1A4D2E]">{brand.title}</h3>
                  <p className="mb-6 text-gray-700 leading-relaxed">{brand.desc}</p>
                  <ul className="space-y-2">
                    {brand.points.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#1A4D2E]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="container-responsive">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-[#1A4D2E] sm:text-4xl"
          >
            Standar Kualitas Produk Toma
          </motion.h2>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Sertifikasi Organik Terverifikasi",
                desc: "Setiap produk memiliki sertifikasi organik dari lembaga independen",
                icon: Shield,
                color: "#1A4D2E"
              },
              {
                title: "Proses Seleksi Petani Ketat",
                desc: "Hanya bekerja dengan petani yang memenuhi standar organik kami",
                icon: Users2,
                color: "#A8C69F"
              },
              {
                title: "Quality Control Multi-Tahap",
                desc: "Inspeksi kualitas di setiap tahap dari panen hingga pengiriman",
                icon: CheckCircle,
                color: "#8B4513"
              },
              {
                title: "Cold Chain Management",
                desc: "Sistem rantai dingin untuk menjaga kesegaran produk organik",
                icon: Truck,
                color: "#B8873B"
              }
            ].map((quality, index) => {
              const IconComponent = quality.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mb-4"
                  >
                    <IconComponent className="h-12 w-12" style={{ color: quality.color }} />
                  </motion.div>
                  <h3 className="mb-3 text-lg font-bold text-[#1A4D2E]">{quality.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{quality.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="bg-gradient-to-br from-[#1A4D2E] to-[#12331c] py-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Transparansi & Ketertelusuran
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-gray-200">
              Dengan teknologi <strong className="text-[#A8C69F]">blockchain</strong>, setiap produk Toma memiliki
              jejak digital lengkap dari petani, proses panen, quality control, hingga pengiriman ke pelanggan Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg font-semibold text-white">
              <div className="rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
                🌱 From Farm
              </div>
              <div className="flex items-center">
                <div className="h-1 w-8 bg-white/30"></div>
              </div>
              <div className="rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
                ✓ Quality Check
              </div>
              <div className="flex items-center">
                <div className="h-1 w-8 bg-white/30"></div>
              </div>
              <div className="rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
                📦 To Table
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
