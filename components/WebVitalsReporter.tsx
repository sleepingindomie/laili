/**
 * Web Vitals Reporter Component
 * Automatically tracks and reports Core Web Vitals
 */

'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVital } from '@/lib/performance/web-vitals';

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    reportWebVital(metric as any);
  });

  return null;
}
