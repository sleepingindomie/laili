'use client';

import { useEffect, useState } from 'react';

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

interface MemoryStats {
  used: string;
  peak: string;
  fragmentation: string;
}

export default function CacheDashboardPage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [memory, setMemory] = useState<MemoryStats | null>(null);
  const [backend, setBackend] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [clearPattern, setClearPattern] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cache/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setMemory(data.data.memory);
        setBackend(data.data.backend);
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async (pattern?: string) => {
    if (!pattern && !confirm('Are you sure you want to clear ALL cache?')) return;

    try {
      const response = await fetch('/api/cache/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setClearPattern('');
        fetchStats();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cache Management</h1>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Refresh Stats
        </button>
      </div>

      {/* Cache Backend */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cache Backend</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${backend === 'redis' ? 'bg-green-500' : 'bg-yellow-500'}`}
            ></div>
            <span className="text-gray-700 font-medium capitalize">{backend}</span>
          </div>
          {backend === 'memory' && (
            <span className="text-sm text-yellow-600">
              Using in-memory cache (Redis not configured)
            </span>
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Hit Rate</div>
          <div className="text-3xl font-bold text-green-600">
            {stats?.hitRate.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {stats?.hits} hits / {stats?.misses} misses
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Cache Hits</div>
          <div className="text-3xl font-bold text-purple-600">{stats?.hits}</div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Cache Sets</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.sets}</div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-sm text-gray-500 mb-1">Cache Deletes</div>
          <div className="text-3xl font-bold text-red-600">{stats?.deletes}</div>
        </div>
      </div>

      {/* Memory Stats */}
      {memory && backend === 'redis' && (
        <div className="mb-6 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Memory Usage</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500">Used Memory</div>
              <div className="text-2xl font-bold text-gray-900">{memory.used}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Peak Memory</div>
              <div className="text-2xl font-bold text-gray-900">{memory.peak}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fragmentation Ratio</div>
              <div className="text-2xl font-bold text-gray-900">
                {memory.fragmentation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Management */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cache Operations</h2>

        <div className="space-y-4">
          {/* Clear by Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clear Cache by Pattern
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={clearPattern}
                onChange={(e) => setClearPattern(e.target.value)}
                placeholder="e.g., user:*, product:*, query:*"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => handleClearCache(clearPattern)}
                disabled={!clearPattern}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Pattern
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Common patterns: user:*, product:*, order:*, query:*, api:*
            </div>
          </div>

          {/* Clear All */}
          <div>
            <button
              onClick={() => handleClearCache()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear All Cache
            </button>
            <div className="mt-2 text-sm text-gray-500">
              Warning: This will clear ALL cached data
            </div>
          </div>

          {/* Quick Clear Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Clear
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleClearCache('user:*')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear Users
              </button>
              <button
                onClick={() => handleClearCache('product:*')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear Products
              </button>
              <button
                onClick={() => handleClearCache('order:*')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear Orders
              </button>
              <button
                onClick={() => handleClearCache('query:*')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear Queries
              </button>
              <button
                onClick={() => handleClearCache('api:*')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear API Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Cache Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Monitor hit rate - aim for 70%+ for optimal performance</li>
          <li>• Clear cache after making data changes to prevent stale data</li>
          <li>• Use specific patterns instead of clearing all cache</li>
          <li>• High fragmentation ratio (&gt;1.5) may indicate memory issues</li>
        </ul>
      </div>
    </div>
  );
}
