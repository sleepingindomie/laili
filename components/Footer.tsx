"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#1A4D2E]">
      <div className="container-responsive py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <Logo width={120} height={38} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="text-center lg:text-left">
            <h4 className="mb-3 font-bold !text-white">PT. Toma Organik Solusi</h4>
            <p className="leading-relaxed text-gray-200">
              Bahan Baku Organik Terbaik, Kunci Kepercayaan Pelanggan Anda
            </p>
          </div>
        </motion.div>

        <div className="border-t border-[#A8C69F]/30 pt-5 text-center text-sm text-gray-300">
          <p>&copy; 2025 PT. Toma Organik Solusi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
