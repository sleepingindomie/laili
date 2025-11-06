"use client";

import Link from "next/link";
import { Instagram, Youtube, Twitter, Linkedin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function SocialMediaPage() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@TomaOrganikID",
      url: "https://instagram.com/TomaOrganikID",
      icon: Instagram,
      gradient: "from-[#E1306C] via-[#C13584] to-[#833AB4]",
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-600",
      description: "Follow untuk update produk organik dan inspirasi pertanian berkelanjutan"
    },
    {
      name: "LinkedIn",
      handle: "Toma Organik Solusi",
      url: "https://linkedin.com/company/toma-organik-solusi",
      icon: Linkedin,
      gradient: "from-[#0077B5] to-[#00A0DC]",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-400",
      description: "Jaringan profesional B2B untuk mitra bisnis organik"
    },
    {
      name: "YouTube",
      handle: "TomaOrganikID",
      url: "https://youtube.com/@TomaOrganikID",
      icon: Youtube,
      gradient: "from-[#FF0000] to-[#CC0000]",
      bgColor: "bg-gradient-to-br from-red-600 to-red-700",
      description: "Video edukasi pertanian organik dan testimoni partner"
    },
    {
      name: "Twitter / X",
      handle: "@TomaB2B",
      url: "https://twitter.com/TomaB2B",
      icon: Twitter,
      gradient: "from-[#1DA1F2] to-[#0C85D0]",
      bgColor: "bg-gradient-to-br from-gray-900 to-gray-700",
      description: "Update terkini seputar industri organik dan B2B"
    },
  ];

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
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="mb-6 inline-block text-7xl"
            >
              📱
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Terhubung dengan Toma
            </h1>
            <p className="text-xl text-gray-200">
              Follow media sosial kami untuk update terbaru, tips pertanian organik, dan inspirasi dari komunitas partner Toma
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Links dengan Liquid Hover Effect */}
      <section className="py-16">
        <div className="container-responsive">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
                    >
                      {/* Liquid Fill Effect - Background yang naik dari bawah */}
                      <motion.div
                        className={`absolute inset-0 ${social.bgColor}`}
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      {/* Blob Morphing Background */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 transition-opacity`}
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 90, 0],
                          borderRadius: ["30%", "50%", "30%"]
                        }}
                        transition={{
                          duration: 10 + index * 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ filter: "blur(60px)" }}
                      />

                      <div className="relative z-10">
                        {/* Icon dengan Scaling Animation */}
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${social.gradient} p-4 shadow-xl`}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </motion.div>

                        {/* Text Content */}
                        <h3 className="mb-2 text-2xl font-bold text-[#1A4D2E] transition-colors group-hover:text-white">
                          {social.name}
                        </h3>
                        <p className="mb-4 text-lg font-medium text-gray-700 transition-colors group-hover:text-white/90">
                          {social.handle}
                        </p>
                        <p className="mb-6 text-sm leading-relaxed text-gray-600 transition-colors group-hover:text-white/80">
                          {social.description}
                        </p>

                        {/* CTA Arrow dengan Animation */}
                        <div className="flex items-center text-sm font-semibold text-[#1A4D2E] transition-colors group-hover:text-white">
                          <span>Kunjungi Sekarang</span>
                          <motion.svg
                            className="ml-2 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </div>
                      </div>

                      {/* Shimmer Effect on Hover */}
                      <motion.div
                        className="absolute inset-0 -z-10"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                        }}
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 rounded-3xl bg-gradient-to-br from-[#1A4D2E] to-[#12331c] p-8 text-center shadow-2xl sm:p-12"
            >
              <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                Bergabunglah dengan Komunitas Toma
              </h3>
              <p className="mb-6 text-lg text-gray-200">
                Dapatkan update eksklusif, tips pertanian organik, dan peluang bisnis B2B langsung dari tim Toma
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((social, idx) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
