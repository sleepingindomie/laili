export default function TagihanPage() {
  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Tagihan</h1>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Total Tagihan Aktif</h2>
          <span className="text-3xl font-bold text-gray-800">Rp 0</span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Riwayat Tagihan</h2>
        <div className="text-center py-12 text-gray-500">
          Belum ada tagihan
        </div>
      </div>
    </div>
  );
}
