"use client";

import { useState } from "react";

export default function UpdateResiPage() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const ordersNeedingResi = [
    {
      id: 1,
      nomorOrder: "ORD-2025-001",
      tanggal: "10 Januari 2025",
      pelanggan: "Siti Aminah",
      produk: "Paket Starter Premium",
      total: 350000,
      status: "Menunggu Resi",
      resi: "",
    },
    {
      id: 2,
      nomorOrder: "ORD-2025-002",
      tanggal: "12 Januari 2025",
      pelanggan: "Dewi Lestari",
      produk: "Paket Complete Bundle",
      total: 750000,
      status: "Menunggu Resi",
      resi: "",
    },
  ];

  const completedOrders = [
    {
      id: 3,
      nomorOrder: "ORD-2024-099",
      tanggal: "28 Desember 2024",
      pelanggan: "Rina Wijaya",
      produk: "Paket Starter",
      resi: "JNE1234567890",
      kurir: "JNE",
      tanggalUpdate: "29 Desember 2024",
    },
    {
      id: 4,
      nomorOrder: "ORD-2024-098",
      tanggal: "25 Desember 2024",
      pelanggan: "Maya Putri",
      produk: "Paket Premium",
      resi: "SICEPAT0987654321",
      kurir: "SiCepat",
      tanggalUpdate: "26 Desember 2024",
    },
  ];

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Update Nomor Resi</h1>
        <p className="mt-2 text-gray-600">
          Kelola dan update nomor resi pengiriman pesanan
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Menunggu Resi</div>
          <div className="text-3xl font-bold text-gray-800">{ordersNeedingResi.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Selesai Update</div>
          <div className="text-3xl font-bold text-gray-800">{completedOrders.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Total Order Bulan Ini</div>
          <div className="text-3xl font-bold text-gray-800">
            {ordersNeedingResi.length + completedOrders.length}
          </div>
        </div>
      </div>

      {/* Orders Needing Resi */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Pesanan Menunggu Nomor Resi
        </h2>
        <div className="space-y-4">
          {ordersNeedingResi.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.nomorOrder}
                    </h3>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{order.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>{order.pelanggan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📦</span>
                      <span>{order.produk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="font-semibold">
                        Rp {order.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Resi Form */}
              <div className="border-t border-gray-100 pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Nomor resi berhasil diupdate!");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`kurir-${order.id}`}
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Pilih Kurir
                      </label>
                      <select
                        id={`kurir-${order.id}`}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        required
                      >
                        <option value="">Pilih kurir...</option>
                        <option value="JNE">JNE</option>
                        <option value="JNT">JNT</option>
                        <option value="SiCepat">SiCepat</option>
                        <option value="Anteraja">Anteraja</option>
                        <option value="PosIndonesia">Pos Indonesia</option>
                        <option value="IDExpress">ID Express</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`resi-${order.id}`}
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Nomor Resi
                      </label>
                      <input
                        type="text"
                        id={`resi-${order.id}`}
                        placeholder="Contoh: JNE1234567890"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="touch-target flex-1 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 sm:flex-initial"
                    >
                      Update Resi
                    </button>
                    <button
                      type="button"
                      className="touch-target rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Lihat Detail Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Orders */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Riwayat Update Resi
        </h2>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Nomor Order
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Pelanggan
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Kurir
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Nomor Resi
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Tanggal Update
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-4 text-gray-800">{order.nomorOrder}</td>
                    <td className="py-4 text-gray-800">{order.pelanggan}</td>
                    <td className="py-4">
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {order.kurir}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-sm text-gray-600">
                      {order.resi}
                    </td>
                    <td className="py-4 text-gray-600">{order.tanggalUpdate}</td>
                    <td className="py-4">
                      <button className="text-sm font-medium text-gray-900 hover:underline">
                        Lacak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-xl border-l-4 border-gray-900 bg-gray-50 p-6">
        <h3 className="mb-2 font-semibold text-gray-800">💡 Tips Update Resi</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Pastikan nomor resi yang diinput sudah benar dan sesuai dengan kurir</li>
          <li>• Update resi segera setelah paket dikirim untuk kepuasan pelanggan</li>
          <li>• Pelanggan akan menerima notifikasi otomatis setelah resi diupdate</li>
          <li>• Anda bisa melacak status pengiriman dengan klik tombol "Lacak"</li>
        </ul>
      </div>
    </div>
  );
}
