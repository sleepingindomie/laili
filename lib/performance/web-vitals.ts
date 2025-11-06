/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

export interface PerformanceData {
  metric: WebVitalsMetric;
  url: string;
  userAgent: string;
  timestamp: number;
}

// Thresholds for Web Vitals ratings
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get rating based on metric value
 */
function getRating(
  metricName: WebVitalsMetric['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metrics to analytics endpoint
 */
async function sendToAnalytics(data: PerformanceData) {
  try {
    // Send to your analytics endpoint
    await fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to send web vitals:', error);
  }
}

/**
 * Report Web Vital metric
 */
export function reportWebVital(metric: WebVitalsMetric) {
  const data: PerformanceData = {
    metric: {
      ...metric,
      rating: getRating(metric.name, metric.value),
    },
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', data);
  }

  // Send to analytics
  sendToAnalytics(data);

  // Store in localStorage for dashboard
  try {
    const stored = localStorage.getItem('web-vitals') || '[]';
    const vitals = JSON.parse(stored);
    vitals.push(data);

    // Keep only last 100 metrics
    if (vitals.length > 100) {
      vitals.shift();
    }

    localStorage.setItem('web-vitals', JSON.stringify(vitals));
  } catch (error) {
    console.error('Failed to store web vitals:', error);
  }
}

/**
 * Get stored Web Vitals from localStorage
 */
export function getStoredWebVitals(): PerformanceData[] {
  try {
    const stored = localStorage.getItem('web-vitals') || '[]';
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get stored web vitals:', error);
    return [];
  }
}

/**
 * Calculate average metrics
 */
export function calculateAverageMetrics(vitals: PerformanceData[]) {
  const metrics: Record<string, { total: number; count: number; values: number[] }> = {};

  vitals.forEach(({ metric }) => {
    if (!metrics[metric.name]) {
      metrics[metric.name] = { total: 0, count: 0, values: [] };
    }
    metrics[metric.name].total += metric.value;
    metrics[metric.name].count += 1;
    metrics[metric.name].values.push(metric.value);
  });

  const averages: Record<string, {
    average: number;
    min: number;
    max: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }> = {};

  Object.entries(metrics).forEach(([name, data]) => {
    const average = data.total / data.count;
    averages[name] = {
      average,
      min: Math.min(...data.values),
      max: Math.max(...data.values),
      rating: getRating(name as WebVitalsMetric['name'], average),
    };
  });

  return averages;
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(vitals: PerformanceData[]): number {
  const averages = calculateAverageMetrics(vitals);
  let score = 0;
  let count = 0;

  Object.entries(averages).forEach(([_, data]) => {
    count++;
    if (data.rating === 'good') score += 100;
    else if (data.rating === 'needs-improvement') score += 50;
    else score += 0;
  });

  return count > 0 ? Math.round(score / count) : 0;
}
