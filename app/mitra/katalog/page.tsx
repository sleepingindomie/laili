"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import OptimizedImage from "@/components/OptimizedImage";
import { motion } from "framer-motion";
import { Search, Leaf, Apple, Carrot, Wheat, Tags } from "lucide-react";

interface Product {
  id: number;
  nama: string;
  harga: number;
  gambar_url: string | null;
  kategori: string | null;
  deskripsi: string | null;
}

export default function MitraKatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const supabase = createClient();

  // Define organic categories with icons
  const organicCategories = [
    { value: "all", label: "Semua Kategori", icon: Tags, color: "#1A4D2E" },
    { value: "Sayuran Organik", label: "Sayuran Organik", icon: Carrot, color: "#A8C69F" },
    { value: "Buah Organik", label: "Buah Organik", icon: Apple, color: "#8B4513" },
    { value: "Rempah & Bumbu", label: "Rempah & Bumbu", icon: Leaf, color: "#B8873B" },
    { value: "Biji-bijian", label: "Biji-bijian", icon: Wheat, color: "#1A4D2E" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('produk')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setProducts(data);
          setFilteredProducts(data);

          const uniqueCategories = Array.from(
            new Set(data.map(p => p.kategori).filter(Boolean))
          ) as string[];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.kategori === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1A4D2E]">Katalog Bahan Baku Organik</h1>
        <p className="mt-2 text-gray-600">Pilih bahan baku organik bersertifikat untuk bisnis Anda</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Cari bahan baku organik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-[#A8C69F]/30 bg-white px-12 py-4 text-gray-700 transition-all focus:border-[#1A4D2E] focus:outline-none focus:ring-4 focus:ring-[#A8C69F]/20"
          />
        </div>
      </motion.div>

      {/* Category Filter Chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-3">
          {organicCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.value;
            return (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium shadow-md transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#1A4D2E] to-[#A8C69F] text-white ring-2 ring-[#1A4D2E]/20"
                    : "bg-white text-gray-700 hover:bg-[#f1f8ed] ring-1 ring-[#A8C69F]/30"
                }`}
              >
                <IconComponent className="h-4 w-4" style={{ color: isActive ? "white" : category.color }} />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-[#A8C69F] border-t-[#1A4D2E]"
          />
          <p className="text-gray-500">Memuat katalog bahan baku organik...</p>
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-[#A8C69F] bg-[#f1f8ed]/30 p-12 text-center"
        >
          <Leaf className="mx-auto mb-4 h-16 w-16 text-[#A8C69F]" />
          <p className="text-lg font-medium text-gray-700">
            {searchQuery || selectedCategory !== "all"
              ? "Tidak ada bahan baku yang sesuai dengan pencarian"
              : "Belum ada produk tersedia"}
          </p>
          <p className="mt-2 text-sm text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#f1f8ed] to-[#A8C69F]/20">
                <OptimizedImage
                  src={product.gambar_url}
                  alt={product.nama}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  fallback="🌱"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                {product.kategori && (
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1A4D2E] shadow-md backdrop-blur-sm">
                    {product.kategori}
                  </div>
                )}
                {/* Organic Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#1A4D2E] to-[#A8C69F] px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                  <Leaf className="h-3 w-3" />
                  <span>Organik</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-[#1A4D2E] line-clamp-1">{product.nama}</h3>
                {product.deskripsi && (
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">{product.deskripsi}</p>
                )}
                <p className="mb-5 text-3xl font-bold text-[#8B4513]">
                  {formatCurrency(product.harga)}
                </p>

                {/* Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="touch-target w-full rounded-xl bg-gradient-to-r from-[#1A4D2E] to-[#A8C69F] px-6 py-3.5 font-semibold text-white shadow-md transition-all hover:shadow-xl hover:shadow-[#1A4D2E]/20"
                >
                  Pesan Sekarang
                </motion.button>
              </div>

              {/* Hover Gradient Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#1A4D2E]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                style={{ pointerEvents: "none" }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
