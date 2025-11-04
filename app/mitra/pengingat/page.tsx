"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Pengingat {
  id: number;
  judul: string;
  deskripsi: string | null;
  tanggal_pengingat: string;
  tipe: string | null;
  status: string;
  prioritas: string;
  is_notifikasi_terkirim: boolean;
  created_at: string;
}

interface CoachingSchedule {
  id: number;
  judul: string;
  tanggal: string;
  waktu: string;
  coach: string | null;
  link_meeting: string | null;
  keterangan: string | null;
}

export default function PengingatPage() {
  const [pengingats, setPengingats] = useState<Pengingat[]>([]);
  const [coachingSchedules, setCoachingSchedules] = useState<CoachingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal_pengingat: "",
    waktu_pengingat: "",
    tipe: "custom",
    prioritas: "normal",
  });
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch pengingat user
      const { data: pengingatData, error: pengingatError } = await supabase
        .from('pengingat')
        .select('*')
        .eq('user_id', user.id)
        .order('tanggal_pengingat', { ascending: true });

      if (pengingatError) throw pengingatError;
      setPengingats(pengingatData || []);

      // Fetch jadwal coaching yang akan datang
      const today = new Date().toISOString().split('T')[0];
      const { data: coachingData, error: coachingError } = await supabase
        .from('coaching_schedule')
        .select('*')
        .gte('tanggal', today)
        .order('tanggal', { ascending: true })
        .limit(5);

      if (coachingError) throw coachingError;
      setCoachingSchedules(coachingData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPengingat = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const tanggalWaktu = `${formData.tanggal_pengingat}T${formData.waktu_pengingat}:00`;

      const { error } = await supabase
        .from('pengingat')
        .insert({
          user_id: user.id,
          judul: formData.judul,
          deskripsi: formData.deskripsi,
          tanggal_pengingat: tanggalWaktu,
          tipe: formData.tipe,
          prioritas: formData.prioritas,
          status: 'aktif',
        });

      if (error) throw error;

      alert('✅ Pengingat berhasil ditambahkan!');

      // Reset form
      setFormData({
        judul: "",
        deskripsi: "",
        tanggal_pengingat: "",
        waktu_pengingat: "",
        tipe: "custom",
        prioritas: "normal",
      });
      setShowAddForm(false);

      // Refresh data
      fetchData();

    } catch (error: any) {
      console.error('Error adding pengingat:', error);
      alert(error.message || 'Terjadi kesalahan saat menambahkan pengingat');
    }
  };

  const handleMarkAsComplete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('pengingat')
        .update({ status: 'selesai' })
        .eq('id', id);

      if (error) throw error;

      alert('✅ Pengingat ditandai selesai!');
      fetchData();

    } catch (error: any) {
      console.error('Error marking complete:', error);
      alert(error.message || 'Terjadi kesalahan');
    }
  };

  const handleDeletePengingat = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengingat ini?')) return;

    try {
      const { error } = await supabase
        .from('pengingat')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('✅ Pengingat berhasil dihapus!');
      fetchData();

    } catch (error: any) {
      console.error('Error deleting pengingat:', error);
      alert(error.message || 'Terjadi kesalahan saat menghapus');
    }
  };

  const filteredPengingats = pengingats.filter((item) => {
    if (selectedFilter === "Semua") return item.status === 'aktif';
    return item.tipe === selectedFilter.toLowerCase() && item.status === 'aktif';
  });

  const getTypeIcon = (tipe: string | null) => {
    const typeMap: Record<string, string> = {
      'order': '📦',
      'pembayaran': '💰',
      'kelas': '📚',
      'custom': '🔔',
    };
    return typeMap[tipe || 'custom'] || '🔔';
  };

  const getPriorityColor = (prioritas: string) => {
    const colorMap: Record<string, string> = {
      'tinggi': 'bg-red-100 text-red-700',
      'normal': 'bg-blue-100 text-blue-700',
      'rendah': 'bg-gray-100 text-gray-700',
    };
    return colorMap[prioritas] || colorMap['normal'];
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      tanggal: date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      waktu: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pengingat & Jadwal</h1>
          <p className="mt-2 text-gray-600">
            Kelola pengingat dan lihat jadwal coaching mendatang
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="touch-target rounded-lg bg-secondary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-700"
        >
          {showAddForm ? '✕ Tutup' : '➕ Tambah Pengingat'}
        </button>
      </div>

      {/* Add Pengingat Form */}
      {showAddForm && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Buat Pengingat Baru</h2>
          <form onSubmit={handleAddPengingat} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Judul Pengingat *
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="Contoh: Follow up customer Bu Siti"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                rows={3}
                placeholder="Detail pengingat..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tanggal *
                </label>
                <input
                  type="date"
                  value={formData.tanggal_pengingat}
                  onChange={(e) => setFormData({ ...formData, tanggal_pengingat: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Waktu *
                </label>
                <input
                  type="time"
                  value={formData.waktu_pengingat}
                  onChange={(e) => setFormData({ ...formData, waktu_pengingat: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tipe
                </label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                >
                  <option value="custom">Custom</option>
                  <option value="order">Order</option>
                  <option value="pembayaran">Pembayaran</option>
                  <option value="kelas">Kelas</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Prioritas
                </label>
                <select
                  value={formData.prioritas}
                  onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                >
                  <option value="rendah">Rendah</option>
                  <option value="normal">Normal</option>
                  <option value="tinggi">Tinggi</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="touch-target flex-1 rounded-lg bg-secondary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-700 sm:flex-initial"
              >
                Simpan Pengingat
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="touch-target rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Pengingat Aktif</div>
          <div className="text-3xl font-bold text-gray-800">
            {pengingats.filter(p => p.status === 'aktif').length}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Coaching Mendatang</div>
          <div className="text-3xl font-bold text-gray-800">{coachingSchedules.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Prioritas Tinggi</div>
          <div className="text-3xl font-bold text-red-600">
            {pengingats.filter(p => p.prioritas === 'tinggi' && p.status === 'aktif').length}
          </div>
        </div>
      </div>

      {/* Jadwal Coaching Mendatang */}
      {coachingSchedules.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">📅 Jadwal Coaching Mendatang</h2>
          <div className="space-y-3">
            {coachingSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-secondary-50 to-white border border-secondary-200 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-600 text-white">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-800">{schedule.judul}</h3>
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDateTime(schedule.tanggal).tanggal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>{schedule.waktu} WIB</span>
                      </div>
                      {schedule.coach && (
                        <div className="flex items-center gap-2">
                          <span>👨‍🏫</span>
                          <span>{schedule.coach}</span>
                        </div>
                      )}
                    </div>
                    {schedule.keterangan && (
                      <p className="mt-2 text-sm text-gray-600">{schedule.keterangan}</p>
                    )}
                  </div>
                </div>
                {schedule.link_meeting && (
                  <a
                    href={schedule.link_meeting}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target rounded-lg bg-secondary-600 px-6 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-secondary-700"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {["Semua", "Custom", "Order", "Kelas", "Pembayaran"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`touch-target whitespace-nowrap rounded-lg px-6 py-2 font-medium transition-colors ${
              tab === selectedFilter
                ? "bg-secondary-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pengingat List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pengingat Saya</h2>
        {filteredPengingats.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-md">
            {selectedFilter === "Semua" ? 'Belum ada pengingat aktif' : `Tidak ada pengingat untuk tipe ${selectedFilter}`}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPengingats.map((pengingat) => {
              const dateTime = formatDateTime(pengingat.tanggal_pengingat);
              return (
                <div
                  key={pengingat.id}
                  className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                      <span className="text-xl">{getTypeIcon(pengingat.tipe)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-gray-800">{pengingat.judul}</h3>
                      {pengingat.deskripsi && (
                        <p className="mb-2 text-sm text-gray-600">{pengingat.deskripsi}</p>
                      )}
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{dateTime.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{dateTime.waktu}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(pengingat.prioritas)}`}>
                          {pengingat.prioritas}
                        </span>
                        {pengingat.tipe && (
                          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {pengingat.tipe}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <button
                      onClick={() => handleMarkAsComplete(pengingat.id)}
                      className="touch-target flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:flex-initial"
                    >
                      ✓ Selesai
                    </button>
                    <button
                      onClick={() => handleDeletePengingat(pengingat.id)}
                      className="touch-target flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 sm:flex-initial"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
