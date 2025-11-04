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

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            email: user.email || "",
            full_name: data.nama_lengkap || "",
            phone: data.nomor_telepon || "",
            address: data.alamat || "",
            joined_date: data.tanggal_bergabung || "",
          });
        }
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

      const { error } = await supabase
        .from('profiles')
        .update({
          nama_lengkap: userData.full_name,
          nomor_telepon: userData.phone,
          alamat: userData.address,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userData.email}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="email@example.com"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                value={userData.full_name}
                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="08xx-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Alamat</label>
              <textarea
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                rows={3}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="touch-target w-full rounded-lg bg-secondary-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
