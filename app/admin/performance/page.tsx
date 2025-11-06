'use client';

import { useEffect, useState } from 'react';
import {
  getStoredWebVitals,
  calculateAverageMetrics,
  getPerformanceScore,
  PerformanceData,
} from '@/lib/performance/web-vitals';

export default function PerformanceDashboard() {
  const [vitals, setVitals] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVitals = () => {
      const stored = getStoredWebVitals();
      setVitals(stored);
      setLoading(false);
    };

    loadVitals();

    // Refresh every 5 seconds
    const interval = setInterval(loadVitals, 5000);

    return () => clearInterval(interval);
  }, []);

  const averages = calculateAverageMetrics(vitals);
  const score = getPerformanceScore(vitals);

  const getRatingColor = (rating: string) => {
    if (rating === 'good') return 'text-green-600 bg-green-100';
    if (rating === 'needs-improvement') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Memuat data performa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Performance Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor Core Web Vitals dan performa aplikasi
        </p>
      </div>

      {/* Performance Score */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Performance Score</h2>
            <p className="text-sm text-gray-600">
              Berdasarkan {vitals.length} pengukuran
            </p>
          </div>
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Object.entries(averages).map(([name, data]) => (
          <div key={name} className="rounded-xl bg-white p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {name === 'LCP' && 'Largest Contentful Paint'}
                  {name === 'FID' && 'First Input Delay'}
                  {name === 'CLS' && 'Cumulative Layout Shift'}
                  {name === 'FCP' && 'First Contentful Paint'}
                  {name === 'TTFB' && 'Time to First Byte'}
                  {name === 'INP' && 'Interaction to Next Paint'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(
                  data.rating
                )}`}
              >
                {data.rating === 'good' && 'Baik'}
                {data.rating === 'needs-improvement' && 'Perlu Perbaikan'}
                {data.rating === 'poor' && 'Buruk'}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {name === 'CLS'
                    ? data.average.toFixed(3)
                    : `${Math.round(data.average)}ms`}
                </p>
                <p className="text-sm text-gray-600">Average</p>
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Min</p>
                  <p className="font-medium">
                    {name === 'CLS' ? data.min.toFixed(3) : `${Math.round(data.min)}ms`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Max</p>
                  <p className="font-medium">
                    {name === 'CLS' ? data.max.toFixed(3) : `${Math.round(data.max)}ms`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Measurements */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Measurements</h2>

        {vitals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p>Belum ada data pengukuran</p>
            <p className="text-sm mt-2">
              Navigasi aplikasi untuk mulai mengumpulkan metrik performa
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Metric
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    URL
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {vitals.slice(-20).reverse().map((vital, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{vital.metric.name}</td>
                    <td className="py-3 px-4">
                      {vital.metric.name === 'CLS'
                        ? vital.metric.value.toFixed(3)
                        : `${Math.round(vital.metric.value)}ms`}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(
                          vital.metric.rating
                        )}`}
                      >
                        {vital.metric.rating === 'good' && 'Baik'}
                        {vital.metric.rating === 'needs-improvement' && 'Perlu Perbaikan'}
                        {vital.metric.rating === 'poor' && 'Buruk'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">
                      {new URL(vital.url).pathname}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(vital.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Core Web Vitals Guidelines</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> Good: &le;2.5s, Poor: &gt;4s
          </li>
          <li>
            <strong>FID (First Input Delay):</strong> Good: &le;100ms, Poor: &gt;300ms
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Good: &le;0.1, Poor: &gt;0.25
          </li>
          <li>
            <strong>FCP (First Contentful Paint):</strong> Good: &le;1.8s, Poor: &gt;3s
          </li>
          <li>
            <strong>TTFB (Time to First Byte):</strong> Good: &le;800ms, Poor: &gt;1.8s
          </li>
        </ul>
      </div>
    </div>
  );
}
