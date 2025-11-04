export default function MitraProfilPage() {
  return (
    <div className="container-responsive py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Profil Mitra</h1>

      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-100">
              <span className="text-4xl font-bold text-secondary-600">M</span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">Nama Bunda</h2>
              <p className="text-gray-600">Mitra Laili Brand</p>
              <p className="mt-1 text-sm text-gray-500">Bergabung sejak: Januari 2025</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="email@example.com"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                placeholder="08xx-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Alamat</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-200"
                rows={3}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <button className="touch-target w-full rounded-lg bg-secondary-500 px-8 py-4 font-semibold text-white transition-colors hover:bg-secondary-600 sm:w-auto">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
