export default function TotalPenjualanPage() {
  const salesData = [
    { bulan: "Januari 2025", total: 0, transaksi: 0 },
    { bulan: "Desember 2024", total: 0, transaksi: 0 },
  ];

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Total Penjualan</h1>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-600">Total Penjualan Bulan Ini</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">Rp 0</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-600">Jumlah Transaksi</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">0</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm font-medium text-gray-600">Rata-rata per Transaksi</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">Rp 0</div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Riwayat Penjualan</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left font-semibold text-gray-700">Periode</th>
                <th className="py-3 text-left font-semibold text-gray-700">Total Penjualan</th>
                <th className="py-3 text-left font-semibold text-gray-700">Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 text-gray-800">{data.bulan}</td>
                  <td className="py-4 text-gray-800">Rp {data.total.toLocaleString('id-ID')}</td>
                  <td className="py-4 text-gray-600">{data.transaksi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
