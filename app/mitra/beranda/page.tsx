"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Award, Package, GraduationCap, ShoppingCart, FileText, Gift, Truck, CreditCard } from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

export default function MitraBerandaPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPoints: 0,
    activeOrders: 0,
    availableClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const currentMonth = new Date().toISOString().slice(0, 7);

        const [pointsData, ordersData, classesData] = await Promise.all([
          supabase
            .from('poin')
            .select('jumlah')
            .eq('user_id', user.id),
          supabase
            .from('pesanan')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('status', 'proses'),
          supabase
            .from('kelas_video')
            .select('id', { count: 'exact' }),
        ]);

        // Calculate total points from all point records
        const totalPoints = pointsData.data?.reduce((sum, record) => sum + (record.jumlah || 0), 0) || 0;

        setStats({
          totalSales: 0, // Will be calculated from pesanan
          totalPoints: totalPoints,
          activeOrders: ordersData.count || 0,
          availableClasses: classesData.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Penjualan",
      value: stats.totalSales,
      subtitle: "Bulan ini",
      icon: TrendingUp,
      gradient: "from-[#1A4D2E] to-[#A8C69F]",
      isCurrency: true,
    },
    {
      title: "Poin Anda",
      value: stats.totalPoints,
      subtitle: "Total poin terkumpul",
      icon: Award,
      gradient: "from-[#A8C69F] to-[#8B4513]",
      isCurrency: false,
    },
    {
      title: "Order Aktif",
      value: stats.activeOrders,
      subtitle: "Pesanan dalam proses",
      icon: Package,
      gradient: "from-[#8B4513] to-[#B8873B]",
      isCurrency: false,
    },
    {
      title: "Edukasi Tersedia",
      value: stats.availableClasses,
      subtitle: "Program pelatihan baru",
      icon: GraduationCap,
      gradient: "from-[#B8873B] to-[#1A4D2E]",
      isCurrency: false,
    },
  ];

  const quickActions = [
    { icon: ShoppingCart, label: "Order Produk", href: "/mitra/order", color: "#1A4D2E" },
    { icon: GraduationCap, label: "Edukasi & Pelatihan", href: "/mitra/kelas", color: "#A8C69F" },
    { icon: FileText, label: "Laporan Penjualan", href: "/mitra/total-penjualan", color: "#8B4513" },
    { icon: Gift, label: "Tukar Poin", href: "/mitra/hadiah", color: "#B8873B" },
    { icon: Truck, label: "Update Resi", href: "/mitra/update-resi", color: "#1A4D2E" },
    { icon: CreditCard, label: "Tagihan", href: "/mitra/tagihan", color: "#A8C69F" },
  ];

  return (
    <div className="container-responsive py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1A4D2E]">Dashboard Supplier</h1>
        <p className="mt-2 text-gray-600">Selamat datang di Platform Agregator Bahan Baku Organik Toma</p>
      </motion.div>

      {/* Stats Cards with Animation */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
            >
              {/* Gradient Background on Hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
              />

              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">{stat.title}</div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-2`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </motion.div>
                </div>

                <div className="mb-2 text-3xl font-bold text-[#1A4D2E]">
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : stat.isCurrency ? (
                    formatCurrency(stat.value)
                  ) : (
                    <AnimatedCounter target={stat.value} />
                  )}
                </div>

                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              </div>

              {/* Decorative Element */}
              <motion.div
                className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="mb-6 text-2xl font-semibold text-[#1A4D2E]">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.a
                key={index}
                href={action.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group flex touch-target flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 shadow-md ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-xl"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <IconComponent className="h-7 w-7" style={{ color: action.color }} />
                </motion.div>
                <span className="text-center text-sm font-medium text-gray-700 transition-colors group-hover:text-[#1A4D2E]">
                  {action.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-[#1A4D2E]/10"
      >
        <h2 className="mb-6 text-2xl font-semibold text-[#1A4D2E]">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 rounded-xl border-2 border-[#A8C69F]/30 bg-gradient-to-r from-[#f1f8ed] to-white p-4 transition-all hover:border-[#1A4D2E]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1A4D2E] to-[#A8C69F] shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#1A4D2E]">Selamat bergabung di Toma!</p>
              <p className="text-sm text-gray-600">Jelajahi fitur-fitur platform agregator bahan baku organik kami</p>
            </div>
            <span className="rounded-full bg-[#1A4D2E] px-3 py-1 text-xs font-medium text-white">Baru</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
