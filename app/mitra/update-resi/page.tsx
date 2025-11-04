"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Pesanan {
  id: number;
  total_harga: number;
  status: string;
  catatan: string | null;
  resi: string | null;
  tanggal_pesan: string;
  tanggal_selesai: string | null;
  profiles: {
    nama_lengkap: string;
  } | null;
}

interface TrackingResi {
  id: number;
  pesanan_id: number;
  resi: string;
  kurir: string;
  status_pengiriman: string;
  tanggal_update: string;
  pesanan: {
    id: number;
    profiles: {
      nama_lengkap: string;
    } | null;
  };
}

export default function UpdateResiPage() {
  const [ordersNeedingResi, setOrdersNeedingResi] = useState<Pesanan[]>([]);
  const [completedOrders, setCompletedOrders] = useState<TrackingResi[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch pesanan yang belum ada resi (status dikirim tapi resi masih null)
      const { data: needingResiData, error: needingResiError } = await supabase
        .from('pesanan')
        .select(`
          *,
          profiles:user_id (nama_lengkap)
        `)
        .eq('user_id', user.id)
        .is('resi', null)
        .in('status', ['pending', 'diproses'])
        .order('tanggal_pesan', { ascending: false });

      if (needingResiError) throw needingResiError;
      setOrdersNeedingResi(needingResiData || []);

      // Fetch riwayat tracking resi yang sudah diupdate
      const { data: completedData, error: completedError } = await supabase
        .from('tracking_resi')
        .select(`
          id,
          pesanan_id,
          resi,
          kurir,
          status_pengiriman,
          tanggal_update,
          pesanan:pesanan_id (
            id,
            profiles:user_id (nama_lengkap)
          )
        `)
        .order('tanggal_update', { ascending: false })
        .limit(20);

      if (completedError) throw completedError;

      // Transform data to match TrackingResi interface
      const transformedData = (completedData || []).map((item: any) => ({
        ...item,
        pesanan: Array.isArray(item.pesanan) ? {
          ...item.pesanan[0],
          profiles: Array.isArray(item.pesanan[0]?.profiles)
            ? item.pesanan[0].profiles[0]
            : item.pesanan[0]?.profiles
        } : item.pesanan
      }));

      setCompletedOrders(transformedData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResi = async (e: React.FormEvent<HTMLFormElement>, pesananId: number) => {
    e.preventDefault();
    setUpdating(pesananId);

    const formData = new FormData(e.currentTarget);
    const kurir = formData.get('kurir') as string;
    const resi = formData.get('resi') as string;

    try {
      // Update resi di tabel pesanan
      const { error: updateError } = await supabase
        .from('pesanan')
        .update({
          resi: resi,
          status: 'dikirim'
        })
        .eq('id', pesananId);

      if (updateError) throw updateError;

      // Insert tracking resi
      const { error: trackingError } = await supabase
        .from('tracking_resi')
        .insert({
          pesanan_id: pesananId,
          resi: resi,
          kurir: kurir,
          status_pengiriman: 'dikirim',
          lokasi_terakhir: 'Dalam proses pengiriman',
          deskripsi_status: 'Paket telah diserahkan ke kurir',
        });

      if (trackingError) throw trackingError;

      alert('✅ Nomor resi berhasil diupdate!');

      // Refresh data
      fetchData();

      // Reset form
      e.currentTarget.reset();

    } catch (error: any) {
      console.error('Error updating resi:', error);
      alert(error.message || 'Terjadi kesalahan saat update resi');
    } finally {
      setUpdating(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-12 text-gray-500">Memuat data...</div>
      </div>
    );
  }

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
          <div className="text-3xl font-bold text-orange-600">{ordersNeedingResi.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Selesai Update</div>
          <div className="text-3xl font-bold text-green-600">{completedOrders.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Total Order</div>
          <div className="text-3xl font-bold text-gray-800">
            {ordersNeedingResi.length + completedOrders.length}
          </div>
        </div>
      </div>

      {/* Orders Needing Resi */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Pesanan Menunggu Nomor Resi ({ordersNeedingResi.length})
        </h2>
        {ordersNeedingResi.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-md">
            Tidak ada pesanan yang menunggu nomor resi
          </div>
        ) : (
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
                        Order #{order.id}
                      </h3>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {order.status === 'pending' ? 'Pending' : 'Diproses'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDate(order.tanggal_pesan)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{order.profiles?.nama_lengkap || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold">
                          {formatCurrency(order.total_harga)}
                        </span>
                      </div>
                      {order.catatan && (
                        <div className="flex items-start gap-2">
                          <span>📝</span>
                          <span className="italic">{order.catatan}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Update Resi Form */}
                <div className="border-t border-gray-100 pt-4">
                  <form
                    onSubmit={(e) => handleUpdateResi(e, order.id)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`kurir-${order.id}`}
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Pilih Kurir *
                        </label>
                        <select
                          id={`kurir-${order.id}`}
                          name="kurir"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                          required
                        >
                          <option value="">Pilih kurir...</option>
                          <option value="JNE">JNE</option>
                          <option value="J&T Express">J&T Express</option>
                          <option value="SiCepat">SiCepat</option>
                          <option value="Anteraja">Anteraja</option>
                          <option value="Pos Indonesia">Pos Indonesia</option>
                          <option value="ID Express">ID Express</option>
                          <option value="Ninja Xpress">Ninja Xpress</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor={`resi-${order.id}`}
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Nomor Resi *
                        </label>
                        <input
                          type="text"
                          id={`resi-${order.id}`}
                          name="resi"
                          placeholder="Contoh: JNE1234567890"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={updating === order.id}
                        className="touch-target flex-1 rounded-lg bg-secondary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-700 disabled:opacity-50 sm:flex-initial"
                      >
                        {updating === order.id ? 'Memproses...' : '📦 Update Resi'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Riwayat Update Resi
        </h2>
        {completedOrders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-md">
            Belum ada riwayat update resi
          </div>
        ) : (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Pelanggan
                    </th>
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Kurir
                    </th>
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Nomor Resi
                    </th>
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-3 text-left text-sm font-semibold text-gray-700">
                      Tanggal Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((tracking) => (
                    <tr key={tracking.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm text-gray-800">
                        #{tracking.pesanan_id}
                      </td>
                      <td className="py-4 text-sm text-gray-800">
                        {tracking.pesanan?.profiles?.nama_lengkap || 'N/A'}
                      </td>
                      <td className="py-4">
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {tracking.kurir}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-sm text-gray-600">
                        {tracking.resi}
                      </td>
                      <td className="py-4">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {tracking.status_pengiriman}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {formatDate(tracking.tanggal_update)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-xl border-l-4 border-secondary-600 bg-secondary-50 p-6">
        <h3 className="mb-2 font-semibold text-gray-800">💡 Tips Update Resi</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Pastikan nomor resi yang diinput sudah benar dan sesuai dengan kurir</li>
          <li>• Update resi segera setelah paket dikirim untuk kepuasan pelanggan</li>
          <li>• Status pesanan otomatis berubah menjadi "Dikirim" setelah resi diupdate</li>
          <li>• Tracking resi akan tersimpan di riwayat untuk referensi ke depan</li>
        </ul>
      </div>
    </div>
  );
}
