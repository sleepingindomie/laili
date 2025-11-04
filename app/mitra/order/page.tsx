export default function OrderPage() {
  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">History Order</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">Order Pending</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">Sedang Diproses</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">Selesai</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Daftar Order</h2>
        <div className="py-12 text-center text-gray-500">
          Belum ada order
        </div>
      </div>
    </div>
  );
}
