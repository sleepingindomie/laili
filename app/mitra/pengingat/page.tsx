export default function PengingatPage() {
  const reminders = [
    {
      id: 1,
      judul: "Coaching Session Januari",
      tanggal: "15 Januari 2025",
      waktu: "19:00 WIB",
      tipe: "Coaching",
      status: "Akan Datang",
    },
    {
      id: 2,
      judul: "Update Stok Produk Baru",
      tanggal: "10 Januari 2025",
      waktu: "10:00 WIB",
      tipe: "Info",
      status: "Akan Datang",
    },
  ];

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pengingat & Notifikasi</h1>
        <p className="mt-2 text-gray-600">
          Jangan lewatkan event dan update penting dari Laili
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Pengingat Aktif</div>
          <div className="text-3xl font-bold text-gray-800">{reminders.length}</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Event Minggu Ini</div>
          <div className="text-3xl font-bold text-gray-800">1</div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-2 text-sm font-medium text-gray-600">Notifikasi Belum Dibaca</div>
          <div className="text-3xl font-bold text-gray-800">0</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {["Semua", "Coaching", "Info", "Order", "Produk"].map((tab) => (
          <button
            key={tab}
            className={`touch-target whitespace-nowrap rounded-lg px-6 py-2 font-medium transition-colors ${
              tab === "Semua"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                <span className="text-xl">🔔</span>
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">{reminder.judul}</h3>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{reminder.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{reminder.waktu}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {reminder.tipe}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <button className="touch-target flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-initial">
                Detail
              </button>
              <button className="touch-target flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:flex-initial">
                Tandai Selesai
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pengaturan Notifikasi */}
      <div className="mt-12 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Pengaturan Notifikasi</h2>
        <div className="space-y-4">
          {[
            { label: "Email Notifikasi", desc: "Terima notifikasi melalui email" },
            { label: "WhatsApp Notifikasi", desc: "Terima notifikasi melalui WhatsApp" },
            { label: "Reminder Coaching", desc: "Pengingat otomatis untuk sesi coaching" },
            { label: "Update Produk Baru", desc: "Notifikasi ketika ada produk baru" },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="font-medium text-gray-800">{setting.label}</div>
                <div className="text-sm text-gray-600">{setting.desc}</div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked={index < 2} />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
