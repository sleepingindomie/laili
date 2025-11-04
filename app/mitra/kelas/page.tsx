export default function MitraKelasPage() {
  const classes = [
    {
      id: 1,
      title: "Kelas Pengenalan Produk Laili",
      instructor: "Tim Laili",
      duration: "45 menit",
      type: "Video",
      status: "Tersedia",
    },
    {
      id: 2,
      title: "Strategi Marketing Digital",
      instructor: "Coach Sarah",
      duration: "60 menit",
      type: "Video",
      status: "Tersedia",
    },
    {
      id: 3,
      title: "Tips Closing Penjualan",
      instructor: "Coach Dina",
      duration: "30 menit",
      type: "Video",
      status: "Segera",
    },
  ];

  const upcomingCoaching = [
    {
      id: 1,
      title: "Coaching Session - Januari 2025",
      date: "15 Januari 2025",
      time: "19:00 WIB",
      coach: "Coach Mentor",
    },
  ];

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kelas & Coaching</h1>
        <p className="mt-2 text-gray-600">
          Akses video pembelajaran dan jadwal coaching
        </p>
      </div>

      {/* Upcoming Coaching */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Jadwal Coaching Mendatang
        </h2>
        <div className="space-y-4">
          {upcomingCoaching.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{session.title}</h3>
                  <p className="text-sm text-gray-600">
                    {session.date} • {session.time}
                  </p>
                  <p className="text-sm text-gray-500">Pendamping: {session.coach}</p>
                </div>
              </div>
              <button className="touch-target rounded-lg bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600 sm:w-auto">
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Classes */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Video Kelas Online
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-50">
                <span className="text-6xl">🎓</span>
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      cls.status === "Tersedia"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {cls.status}
                  </span>
                  <span className="text-xs text-gray-500">{cls.duration}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  {cls.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Instruktur: {cls.instructor}
                </p>
                <button
                  className="touch-target w-full rounded-lg bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:opacity-50"
                  disabled={cls.status !== "Tersedia"}
                >
                  {cls.status === "Tersedia" ? "Mulai Belajar" : "Segera Hadir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
