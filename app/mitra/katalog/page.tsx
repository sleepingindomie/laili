"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        <p className="mt-2 text-gray-600">Pilih produk untuk dipesan</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat data...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery || selectedCategory !== "all"
            ? "Tidak ada produk yang sesuai dengan pencarian"
            : "Belum ada produk tersedia"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-50">
                {product.gambar_url ? (
                  <img
                    src={product.gambar_url}
                    alt={product.nama}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🌸</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">{product.nama}</h3>
                {product.deskripsi && (
                  <p className="mb-2 text-sm text-gray-600 line-clamp-2">{product.deskripsi}</p>
                )}
                <p className="mb-4 text-2xl font-bold text-secondary-600">
                  {formatCurrency(product.harga)}
                </p>
                <div className="mb-4 flex items-center justify-between">
                  {product.kategori && (
                    <span className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700">{product.kategori}</span>
                  )}
                </div>
                <button
                  className="touch-target w-full rounded-lg bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
