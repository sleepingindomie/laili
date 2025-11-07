"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Clock, User, Video, Award, BookOpen, Sprout } from "lucide-react";

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#1A4D2E]">Edukasi & Pelatihan Pertanian Organik</h1>
        <p className="mt-2 text-gray-600">
          Tingkatkan kemampuan Anda dalam pertanian organik melalui program pelatihan dan sertifikasi
        </p>
      </motion.div>

      {/* Program Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {[
          { icon: Video, label: "Video Pembelajaran", count: classes.length, color: "#1A4D2E" },
          { icon: Calendar, label: "Jadwal Pelatihan", count: upcomingCoaching.length, color: "#A8C69F" },
          { icon: Award, label: "Sertifikasi Organik", count: "Segera", color: "#8B4513" },
        ].map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md ring-1 ring-[#1A4D2E]/10"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <IconComponent className="h-6 w-6" style={{ color: category.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{category.label}</p>
                <p className="text-xl font-bold text-[#1A4D2E]">{category.count}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Upcoming Training Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-5 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-[#1A4D2E]" />
          <h2 className="text-2xl font-semibold text-[#1A4D2E]">Jadwal Pelatihan Mendatang</h2>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center"
            >
              <div className="h-12 w-12 rounded-full border-4 border-[#A8C69F] border-t-[#1A4D2E]"></div>
            </motion.div>
            <p className="text-gray-500">Memuat jadwal pelatihan...</p>
          </motion.div>
        ) : upcomingCoaching.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-[#A8C69F] bg-[#f1f8ed]/30 p-10 text-center"
          >
            <Sprout className="mx-auto mb-4 h-14 w-14 text-[#A8C69F]" />
            <p className="text-lg font-medium text-gray-700">Belum ada jadwal pelatihan mendatang</p>
            <p className="mt-2 text-sm text-gray-500">Pelatihan baru akan segera diumumkan</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {upcomingCoaching.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5, scale: 1.01 }}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1A4D2E] to-[#A8C69F] shadow-md"
                  >
                    <Calendar className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A4D2E]">{session.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {session.coach}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="touch-target whitespace-nowrap rounded-xl bg-gradient-to-r from-[#1A4D2E] to-[#A8C69F] px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg sm:w-auto"
                >
                  Lihat Detail
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Video Learning Library */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-[#1A4D2E]" />
          <h2 className="text-2xl font-semibold text-[#1A4D2E]">Video Pembelajaran Organik</h2>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center"
            >
              <div className="h-12 w-12 rounded-full border-4 border-[#A8C69F] border-t-[#1A4D2E]"></div>
            </motion.div>
            <p className="text-gray-500">Memuat video pembelajaran...</p>
          </motion.div>
        ) : classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-[#A8C69F] bg-[#f1f8ed]/30 p-10 text-center"
          >
            <GraduationCap className="mx-auto mb-4 h-14 w-14 text-[#A8C69F]" />
            <p className="text-lg font-medium text-gray-700">Belum ada video pembelajaran tersedia</p>
            <p className="mt-2 text-sm text-gray-500">Video edukasi baru akan segera ditambahkan</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#1A4D2E]/10 transition-all hover:shadow-2xl"
              >
                {/* Video Thumbnail */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A4D2E] to-[#A8C69F]">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <GraduationCap className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Status Badge */}
                  <div
                    className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-md ${
                      cls.status === "Tersedia"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {cls.status}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1A4D2E] shadow-md backdrop-blur-sm">
                    <Clock className="h-3 w-3" />
                    {cls.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-[#1A4D2E] line-clamp-2">
                    {cls.title}
                  </h3>
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Instruktur: {cls.instructor}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="touch-target w-full rounded-xl bg-gradient-to-r from-[#1A4D2E] to-[#A8C69F] px-6 py-3.5 font-semibold text-white shadow-md transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cls.status !== "Tersedia"}
                  >
                    {cls.status === "Tersedia" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Video className="h-4 w-4" />
                        Mulai Belajar
                      </span>
                    ) : (
                      "Segera Hadir"
                    )}
                  </motion.button>
                </div>

                {/* Hover Gradient Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#1A4D2E]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ pointerEvents: "none" }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
