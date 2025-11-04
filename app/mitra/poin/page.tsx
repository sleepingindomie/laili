export default function PoinPage() {
  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Poin Reward</h1>

      <div className="mb-8 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white shadow-lg">
        <div className="mb-2 text-sm opacity-90">Total Poin Anda</div>
        <div className="text-5xl font-bold">0</div>
        <div className="mt-4 text-sm opacity-75">Kumpulkan poin dan tukarkan dengan hadiah menarik</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Cara Mendapatkan Poin</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <div>
                <div className="font-medium">Pembelian Produk</div>
                <div className="text-sm text-gray-600">Dapatkan 1 poin untuk setiap Rp 10.000</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <div>
                <div className="font-medium">Referral Mitra Baru</div>
                <div className="text-sm text-gray-600">Bonus 100 poin per referral</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Riwayat Poin</h2>
          <div className="py-8 text-center text-gray-500">Belum ada riwayat poin</div>
        </div>
      </div>
    </div>
  );
}
