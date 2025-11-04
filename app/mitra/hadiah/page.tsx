"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Hadiah {
  id: number;
  nama: string;
  deskripsi: string | null;
  poin_dibutuhkan: number;
  gambar_url: string | null;
  stok: number;
  status: string;
  kategori: string | null;
}

interface PenukaranHadiah {
  id: number;
  hadiah_id: number;
  poin_digunakan: number;
  status: string;
  tanggal_penukaran: string;
  hadiah: {
    nama: string;
  };
}

export default function HadiahPage() {
  const [hadiahs, setHadiahs] = useState<Hadiah[]>([]);
  const [riwayatPenukaran, setRiwayatPenukaran] = useState<PenukaranHadiah[]>([]);
  const [totalPoin, setTotalPoin] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua Kategori");
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch hadiah yang tersedia
      const { data: hadiahData, error: hadiahError } = await supabase
        .from('hadiah')
        .select('*')
        .eq('status', 'tersedia')
        .order('poin_dibutuhkan', { ascending: true });

      if (hadiahError) throw hadiahError;
      setHadiahs(hadiahData || []);

      // Fetch total poin user
      const { data: poinData, error: poinError } = await supabase
        .from('poin')
        .select('jumlah')
        .eq('user_id', user.id);

      if (poinError) throw poinError;
      const total = poinData?.reduce((sum, record) => sum + (record.jumlah || 0), 0) || 0;
      setTotalPoin(total);

      // Fetch riwayat penukaran
      const { data: riwayatData, error: riwayatError } = await supabase
        .from('penukaran_hadiah')
        .select(`
          id,
          hadiah_id,
          poin_digunakan,
          status,
          tanggal_penukaran,
          hadiah!penukaran_hadiah_hadiah_id_fkey (nama)
        `)
        .eq('user_id', user.id)
        .order('tanggal_penukaran', { ascending: false })
        .limit(10);

      if (riwayatError) throw riwayatError;

      // Transform data to match PenukaranHadiah interface
      const transformedData = (riwayatData || []).map((item: any) => ({
        ...item,
        hadiah: Array.isArray(item.hadiah) ? item.hadiah[0] : item.hadiah
      }));

      setRiwayatPenukaran(transformedData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTukarHadiah = async (hadiah: Hadiah) => {
    if (totalPoin < hadiah.poin_dibutuhkan) {
      alert('Poin Anda tidak cukup untuk menukar hadiah ini');
      return;
    }

    if (hadiah.stok <= 0) {
      alert('Maaf, stok hadiah ini sedang habis');
      return;
    }

    const confirmed = confirm(
      `Yakin ingin menukar ${hadiah.poin_dibutuhkan} poin dengan ${hadiah.nama}?`
    );

    if (!confirmed) return;

    setRedeeming(hadiah.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Insert penukaran hadiah
      const { error: insertError } = await supabase
        .from('penukaran_hadiah')
        .insert({
          user_id: user.id,
          hadiah_id: hadiah.id,
          poin_digunakan: hadiah.poin_dibutuhkan,
          status: 'pending',
        });

      if (insertError) throw insertError;

      // Kurangi poin user
      const { error: poinError } = await supabase
        .from('poin')
        .insert({
          user_id: user.id,
          jumlah: -hadiah.poin_dibutuhkan,
          sumber: 'penukaran',
          keterangan: `Penukaran hadiah: ${hadiah.nama}`,
        });

      if (poinError) throw poinError;

      alert('Penukaran berhasil! Tim kami akan segera memproses permintaan Anda.');

      // Refresh data
      fetchData();

    } catch (error: any) {
      console.error('Error redeeming:', error);
      alert(error.message || 'Terjadi kesalahan saat menukar hadiah');
    } finally {
      setRedeeming(null);
    }
  };

  const filteredHadiahs = hadiahs.filter((hadiah) => {
    const matchSearch = hadiah.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = selectedKategori === "Semua Kategori" || hadiah.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  const kategoris = ["Semua Kategori", ...Array.from(new Set(hadiahs.map(h => h.kategori).filter(Boolean)))];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
      'disetujui': { label: 'Disetujui', color: 'bg-blue-100 text-blue-700' },
      'dikirim': { label: 'Dikirim', color: 'bg-purple-100 text-purple-700' },
      'selesai': { label: 'Selesai', color: 'bg-green-100 text-green-700' },
      'dibatalkan': { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
    };

    const badge = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-12 text-gray-500">Memuat data hadiah...</div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Hadiah</h1>
        <p className="mt-2 text-gray-600">
          Tukarkan poin Anda dengan berbagai hadiah menarik
        </p>
      </div>

      {/* Poin Summary */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Poin Tersedia</div>
            <div className="text-4xl font-bold">{totalPoin.toLocaleString('id-ID')}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Total Penukaran</div>
            <div className="text-2xl font-semibold">{riwayatPenukaran.length}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Cari hadiah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
        />
        <select
          value={selectedKategori}
          onChange={(e) => setSelectedKategori(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
        >
          {kategoris.map((kategori) => (
            <option key={kategori || 'all'} value={kategori || 'Semua Kategori'}>{kategori}</option>
          ))}
        </select>
      </div>

      {/* Rewards Grid */}
      {filteredHadiahs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? 'Tidak ada hadiah yang sesuai dengan pencarian' : 'Belum ada hadiah tersedia'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHadiahs.map((hadiah) => (
            <div
              key={hadiah.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                {hadiah.gambar_url ? (
                  <Image
                    src={hadiah.gambar_url}
                    alt={hadiah.nama}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-6xl">🎁</span>
                )}
                {hadiah.kategori && (
                  <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {hadiah.kategori}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">{hadiah.nama}</h3>
                {hadiah.deskripsi && (
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">{hadiah.deskripsi}</p>
                )}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-secondary-600">
                      {hadiah.poin_dibutuhkan.toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm text-gray-600">Poin</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    hadiah.stok > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {hadiah.stok > 0 ? `Stok: ${hadiah.stok}` : 'Habis'}
                  </span>
                </div>
                <button
                  onClick={() => handleTukarHadiah(hadiah)}
                  disabled={
                    totalPoin < hadiah.poin_dibutuhkan ||
                    hadiah.stok <= 0 ||
                    redeeming === hadiah.id
                  }
                  className="touch-target w-full rounded-lg bg-secondary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redeeming === hadiah.id
                    ? 'Memproses...'
                    : totalPoin < hadiah.poin_dibutuhkan
                    ? 'Poin Tidak Cukup'
                    : hadiah.stok <= 0
                    ? 'Stok Habis'
                    : 'Tukar Hadiah'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Riwayat Penukaran */}
      <div className="mt-12 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Riwayat Penukaran</h2>
        {riwayatPenukaran.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Belum ada riwayat penukaran hadiah
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3 font-medium">Tanggal</th>
                  <th className="pb-3 font-medium">Hadiah</th>
                  <th className="pb-3 font-medium text-right">Poin</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {riwayatPenukaran.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="py-4 text-gray-600">
                      {new Date(item.tanggal_penukaran).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 font-medium text-gray-800">
                      {item.hadiah?.nama || 'N/A'}
                    </td>
                    <td className="py-4 text-right font-semibold text-secondary-600">
                      {item.poin_digunakan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
