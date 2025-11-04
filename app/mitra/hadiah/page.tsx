export default function HadiahPage() {
  const rewards = [
    {
      id: 1,
      nama: "Voucher Belanja Rp 50.000",
      poin: 500,
      stok: "Tersedia",
      image: "🎁",
    },
    {
      id: 2,
      nama: "Voucher Belanja Rp 100.000",
      poin: 1000,
      stok: "Tersedia",
      image: "🎁",
    },
    {
      id: 3,
      nama: "Hampers Spesial",
      poin: 2000,
      stok: "Terbatas",
      image: "🎁",
    },
    {
      id: 4,
      nama: "Bonus Produk Gratis",
      poin: 3000,
      stok: "Tersedia",
      image: "🎁",
    },
  ];

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Hadiah</h1>
        <p className="mt-2 text-gray-600">
          Tukarkan poin Anda dengan berbagai hadiah menarik
        </p>
      </div>

      {/* Poin Summary */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Poin Tersedia</div>
            <div className="text-4xl font-bold">0</div>
          </div>
          <button className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
            Lihat Riwayat
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Cari hadiah..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <select className="rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <option>Semua Kategori</option>
          <option>Voucher</option>
          <option>Produk</option>
          <option>Hampers</option>
        </select>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
              <span className="text-6xl">{reward.image}</span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">{reward.nama}</h3>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{reward.poin}</span>
                  <span className="text-sm text-gray-600">Poin</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    reward.stok === "Tersedia" ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {reward.stok}
                </span>
              </div>
              <button className="touch-target w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
                Tukar Hadiah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Riwayat Penukaran */}
      <div className="mt-12 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Riwayat Penukaran</h2>
        <div className="py-12 text-center text-gray-500">
          Belum ada riwayat penukaran hadiah
        </div>
      </div>
    </div>
  );
}
