"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MitraProfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState({
    email: "",
    full_name: "",
    phone: "",
    address: "",
    joined_date: "",
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Ambil data profil dari database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        // Set user data - jika data ada, gunakan dari DB, jika tidak gunakan default
        setUserData({
          email: user.email || "",
          full_name: data?.nama_lengkap || "",
          phone: data?.nomor_telepon || "",
          address: data?.alamat || "",
          joined_date: data?.tanggal_bergabung || new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Validasi input
      if (!userData.full_name.trim()) {
        throw new Error("Nama lengkap harus diisi");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          nama_lengkap: userData.full_name.trim(),
          nomor_telepon: userData.phone.trim(),
          alamat: userData.address.trim(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "✅ Profil berhasil diperbarui!" });

      // Auto-hide success message setelah 3 detik
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Terjadi kesalahan saat menyimpan data" });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Januari 2025";
    return new Date(dateString).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-8 text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Profil Mitra</h1>

      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-100">
              <span className="text-4xl font-bold text-secondary-600">
                {userData.full_name ? userData.full_name[0].toUpperCase() : "M"}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {userData.full_name || "Nama Bunda"}
              </h2>
              <p className="text-gray-600">Mitra Laili Brand</p>
              <p className="mt-1 text-sm text-gray-500">
                Bergabung sejak: {formatDate(userData.joined_date)}
              </p>
            </div>
          </div>

          {message.text && (
            <div
              className={`mb-6 rounded-lg p-4 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
                <span className="ml-1 text-xs text-gray-500">(tidak dapat diubah)</span>
              </label>
              <input
                type="email"
                value={userData.email}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="email@example.com"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userData.full_name}
                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="08xx-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                rows={4}
                placeholder="Masukkan alamat lengkap untuk pengiriman"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="touch-target flex-1 rounded-lg bg-secondary-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:opacity-50 sm:flex-initial"
              >
                {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
              </button>

              {userData.full_name && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="touch-target rounded-lg border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  🔄 Batal
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Wajib diisi
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
