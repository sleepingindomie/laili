export default function MitraBerandaPage() {
  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Mitra</h1>
        <p className="mt-2 text-gray-600">Selamat datang di platform kemitraan Laili</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Total Penjualan</div>
          <div className="text-2xl font-bold text-secondary-600">Rp 0</div>
          <div className="mt-2 text-xs text-gray-500">Bulan ini</div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Poin Anda</div>
          <div className="text-2xl font-bold text-secondary-600">0</div>
          <div className="mt-2 text-xs text-gray-500">Total poin terkumpul</div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Order Aktif</div>
          <div className="text-2xl font-bold text-secondary-600">0</div>
          <div className="mt-2 text-xs text-gray-500">Pesanan dalam proses</div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Kelas Tersedia</div>
          <div className="text-2xl font-bold text-secondary-600">0</div>
          <div className="mt-2 text-xs text-gray-500">Video pembelajaran baru</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { icon: "🛒", label: "Order Produk", href: "/mitra/order" },
            { icon: "📚", label: "Kelas Online", href: "/mitra/kelas" },
            { icon: "📊", label: "Laporan", href: "/mitra/total-penjualan" },
            { icon: "🎁", label: "Tukar Poin", href: "/mitra/hadiah" },
            { icon: "📦", label: "Update Resi", href: "/mitra/update-resi" },
            { icon: "💳", label: "Tagihan", href: "/mitra/tagihan" },
          ].map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex touch-target flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <span className="text-4xl">{action.icon}</span>
              <span className="text-center text-sm font-medium text-gray-700">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100">
              <span className="text-lg">📚</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Selamat datang di Laili Mitra!</p>
              <p className="text-sm text-gray-500">Mulai jelajahi fitur-fitur yang tersedia</p>
            </div>
            <span className="text-xs text-gray-400">Baru</span>
          </div>
        </div>
      </div>
    </div>
  );
}
