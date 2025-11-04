"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Class {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  type: string;
  status: string;
}

interface CoachingSession {
  id: number;
  title: string;
  date: string;
  time: string;
  coach: string;
}

export default function MitraKelasPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [upcomingCoaching, setUpcomingCoaching] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, coachingData] = await Promise.all([
          supabase
            .from('kelas_video')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('coaching_schedule')
            .select('*')
            .gte('tanggal', new Date().toISOString().split('T')[0])
            .order('tanggal', { ascending: true }),
        ]);

        if (classesData.data) {
          setClasses(classesData.data.map(cls => ({
            id: cls.id,
            title: cls.judul || '',
            instructor: cls.instruktur || '',
            duration: cls.durasi || '',
            type: cls.tipe || '',
            status: 'Tersedia',
          })));
        }

        if (coachingData.data) {
          setUpcomingCoaching(coachingData.data.map(session => ({
            id: session.id,
            title: session.judul || '',
            date: new Date(session.tanggal).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            time: session.waktu || '',
            coach: session.pembicara || '',
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

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
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : upcomingCoaching.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada jadwal coaching mendatang</div>
        ) : (
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
        )}
      </div>

      {/* Video Classes */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Video Kelas Online
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada kelas tersedia</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
