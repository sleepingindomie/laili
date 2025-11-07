"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Leaf, ShieldCheck, TrendingUp, Users, Package, Bell } from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effect for hero
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-white via-[#f1f8ed] to-white">
      <Navigation />

      {/* Hero Section dengan Morphing Background */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden py-16 sm:py-24"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              borderRadius: ["30%", "50%", "30%"]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 h-80 w-80 bg-gradient-to-br from-[#A8C69F]/30 to-[#1A4D2E]/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              borderRadius: ["40%", "60%", "40%"]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-0 right-0 h-80 w-80 bg-gradient-to-tl from-[#B8873B]/20 to-[#8B4513]/10 blur-3xl"
          />
        </div>

        <div className="container-responsive">
          <div className="mx-auto max-w-4xl">
            {/* Logo dengan Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-10 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-[#1A4D2E]/10"
              >
                <Logo width={160} height={52} priority />
              </motion.div>
            </motion.div>

            {/* Hero Text dengan Typewriter Effect Style */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h1
                  className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Platform Agregator
                  <br />
                  <span className="text-[#1A4D2E]">
                    Bahan Baku Organik B2B
                  </span>
                  <br />
                  Terpercaya
                </motion.h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl"
              >
                <strong className="text-[#1A4D2E]">Transparansi</strong> · <strong className="text-[#8B4513]">Kualitas</strong> · <strong className="text-[#A8C69F]">Keberlanjutan</strong>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600"
              >
                Bahan Baku Organik Terbaik, Kunci Kepercayaan Pelanggan Anda
              </motion.p>

              {/* CTA Buttons dengan Liquid Fill Effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col justify-center gap-4 sm:flex-row"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="group relative inline-block overflow-hidden rounded-xl bg-[#1A4D2E] px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#12331c] to-[#1A4D2E]"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Bergabung Sebagai Supplier/Klien</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/profil"
                    className="inline-block rounded-xl border-2 border-[#1A4D2E] bg-white px-8 py-4 text-center text-lg font-semibold text-[#1A4D2E] shadow-lg transition-all hover:bg-[#e8f5e9]"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section dengan Counter Animation */}
      <section className="bg-white py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: 500, suffix: "+", label: "Petani Mitra" },
              { value: 50, suffix: "+", label: "Jenis Produk" },
              { value: 99, suffix: "%", label: "Organik Bersertifikat" },
              { value: 24, suffix: "/7", label: "Dukungan" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#1A4D2E] sm:text-4xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section dengan 3D Tilt Cards */}
      <section className="py-16 sm:py-20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold !text-[#1A4D2E] sm:text-4xl">
              Fasilitas untuk Partner Anda
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Semua yang Anda butuhkan untuk sukses dalam satu platform terintegrasi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Edukasi Pertanian Organik",
                description: "Akses pelatihan dan sertifikasi organik untuk meningkatkan kualitas produk Anda",
                icon: Leaf,
                gradient: "from-[#A8C69F] to-[#1A4D2E]"
              },
              {
                title: "Katalog Bahan Baku Bersertifikat",
                description: "Jelajahi ribuan produk organik dengan sertifikasi lengkap dan ketertelusuran jelas",
                icon: Package,
                gradient: "from-[#1A4D2E] to-[#8B4513]"
              },
              {
                title: "Laporan Rantai Pasok Transparan",
                description: "Pantau setiap tahap dari petani hingga pelanggan dengan teknologi blockchain",
                icon: TrendingUp,
                gradient: "from-[#8B4513] to-[#B8873B]"
              },
              {
                title: "Sistem Poin Loyalitas",
                description: "Kumpulkan poin dari setiap transaksi dan dapatkan reward eksklusif",
                icon: ShieldCheck,
                gradient: "from-[#B8873B] to-[#A8C69F]"
              },
              {
                title: "Pengingat Panen & Pemesanan",
                description: "Notifikasi otomatis untuk jadwal panen, pesanan, dan update penting",
                icon: Bell,
                gradient: "from-[#A8C69F] to-[#1A4D2E]"
              },
              {
                title: "Tracking Resi Real-Time",
                description: "Lacak pengiriman secara real-time dengan cold chain monitoring",
                icon: Users,
                gradient: "from-[#1A4D2E] to-[#B8873B]"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -8,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02
                  }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Gradient Overlay on Hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-md`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>
                    <h3 className="mb-3 text-xl font-semibold text-[#1A4D2E]">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Badge "Premium" untuk beberapa fitur */}
                  {index < 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-[#B8873B] to-[#8B4513] px-3 py-1 text-xs font-semibold text-white shadow-md"
                    >
                      Premium
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section - Organic Certification */}
      <section className="bg-gradient-to-br from-[#1A4D2E] to-[#12331c] py-16 sm:py-20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="mb-6 inline-flex rounded-full bg-[#B8873B] p-4 shadow-2xl"
            >
              <ShieldCheck className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              100% Sertifikasi Organik Terverifikasi
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-200">
              Setiap produk di platform kami memiliki sertifikasi organik yang diverifikasi oleh lembaga independen.
              Transparansi dan kepercayaan adalah prioritas utama kami.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/brand"
                className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#1A4D2E] shadow-xl transition-all hover:shadow-2xl"
              >
                Pelajari Standar Kualitas Kami
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section dengan Wave Pattern */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        {/* SVG Wave Background */}
        <div className="absolute inset-0 -z-10">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <motion.path
              animate={{
                d: [
                  "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,144C672,128,768,128,864,144C960,160,1056,192,1152,192C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              fill="#A8C69F"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <div className="container-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[#1A4D2E] to-[#0e2615] p-10 text-center shadow-2xl ring-1 ring-white/10 sm:p-12"
          >
            <motion.h2
              className="mb-6 text-3xl font-bold text-white sm:text-4xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Siap Bergabung dengan Toma?
            </motion.h2>
            <motion.p
              className="mb-8 text-lg leading-relaxed text-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Mulai perjalanan bisnis organik Anda bersama kami dan raih kepercayaan pelanggan yang berkelanjutan
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="inline-block rounded-xl bg-gradient-to-r from-[#B8873B] to-[#8B4513] px-10 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
              >
                Daftar Sekarang - Gratis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
