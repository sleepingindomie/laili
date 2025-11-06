# Caching System - Complete Implementation Guide

## 📊 Overview

Implementasi caching system yang komprehensif dengan dukungan:
- ✅ Redis untuk production caching
- ✅ In-memory fallback untuk development
- ✅ Supabase query caching
- ✅ Next.js caching strategies (ISR, SSG, revalidation)
- ✅ API route caching
- ✅ Cache tagging dan invalidation
- ✅ Cache statistics dan monitoring

---

## 🏗️ architecture

```
┌─────────────────────────────────────────┐
│         Application Layer               │
├─────────────────────────────────────────┤
│  React Hooks  │  API Routes  │  Server  │
│  useCached    │  /api/*      │  Actions │
│  Query        │              │          │
└───────┬───────┴──────┬───────┴────┬─────┘
        │              │            │
        └──────────────┴────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     Cache Service           │
        │  (cache-service.ts)         │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    Redis Client             │
        │  (redis-client.ts)          │
        ├──────────────┬──────────────┤
        │              │              │
     ┌──▼──┐        ┌──▼──────┐
     │Redis│        │ Memory  │
     │     │        │  Cache  │
     └─────┘        └─────────┘
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

Dependencies sudah ter-install:
```bash
npm install ioredis
```

### 2. Setup Redis (Choose One)

#### Option A: Upstash Redis (Recommended for Production)

1. Sign up at [https://upstash.com/](https://upstash.com/)
2. Create a new Redis database
3. Copy the Redis URL
4. Add to `.env.local`:

```env
REDIS_URL=rediss://default:xxxxx@xxxxx.upstash.io:6379
```

#### Option B: Local Redis (Development)

Using Docker:
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

Using Redis installed locally:
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://redis.io/download
```

Then add to `.env.local`:
```env
REDIS_URL=redis://localhost:6379
```

### 3. Configure Environment Variables

Update `.env.local`:

```env
# Cache Configuration
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=3600        # 1 hour in seconds
CACHE_MAX_MEMORY=100mb

# Redis URL
REDIS_URL=your-redis-url-here

# Revalidation Secret
REVALIDATION_SECRET=your-secret-key-here
```

Generate revalidation secret:
```bash
openssl rand -base64 32
```

---

## 💻 Usage Examples

### 1. Using Cache Service Directly

```typescript
import { cache } from '@/lib/cache/cache-service';
import { generateCacheKey, getCacheTTL } from '@/lib/cache/config';

// Set cache
await cache.set('user:123', userData, {
  ttl: getCacheTTL('user'),
  tags: ['users', 'user:123'],
});

// Get cache
const user = await cache.get('user:123');

// Get or set (fetch if not exists)
const products = await cache.getOrSet(
  'products:all',
  async () => {
    // Fetch from database
    const { data } = await supabase.from('produk').select('*');
    return data;
  },
  { ttl: getCacheTTL('product') }
);

// Delete cache
await cache.delete('user:123');

// Delete by pattern
await cache.deletePattern('user:*');

// Invalidate by tag
await cache.invalidateByTag('users');
```

### 2. Using Cached Supabase Queries

```typescript
import { cachedQuery, getCachedProducts } from '@/lib/cache/cached-supabase';
import { createClient } from '@/lib/supabase/client';

// Custom cached query
const products = await cachedQuery(
  supabase,
  'produk',
  (query) => query.select('*').order('created_at', { ascending: false }),
  {
    ttl: 3600,
    tags: ['products'],
  }
);

// Using helper functions
const products = await getCachedProducts(supabase);
const product = await getCachedProductById(supabase, 123);
```

### 3. Using React Hooks

```typescript
import { useCachedProducts, useCachedQuery } from '@/lib/hooks/useCachedQuery';

function ProductList() {
  const { data: products, loading, error, refetch } = useCachedProducts({
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Custom hook usage
function MyComponent() {
  const { data, loading, invalidate } = useCachedQuery(
    'my_table',
    (query) => query.select('*'),
    {
      cachePrefix: 'query',
      customTTL: 1800, // 30 minutes
      tags: ['my_table'],
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleUpdate = async () => {
    // Update data
    await updateData();
    // Invalidate cache
    await invalidate();
  };

  return (
    // Your component
  );
}
```

### 4. API Route Caching

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache/cache-service';
import { generateCacheKey } from '@/lib/cache/config';

export async function GET() {
  const cacheKey = generateCacheKey('api', 'products', 'list');

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  // Fetch from database
  const { data, error } = await supabase
    .from('produk')
    .select('*');

  if (error) throw error;

  // Cache the result
  await cache.set(cacheKey, data, {
    ttl: 3600,
    tags: ['products'],
  });

  return NextResponse.json({
    success: true,
    data,
    cached: false,
  });
}
```

### 5. Next.js Revalidation

Revalidate on-demand:

```typescript
// Trigger from anywhere
const response = await fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: process.env.REVALIDATION_SECRET,
    path: '/mitra/katalog', // or
    tag: 'products',
  }),
});
```

---

## 🏷️ Cache Key Patterns

```typescript
// User related
user:{userId}
user:{userId}:profile
user:{userId}:orders
user:{userId}:transactions

// Products
product:{productId}
product:list
product:category:{categoryId}

// Orders
order:{orderId}
order:user:{userId}

// Queries
query:{tableName}:{queryHash}

// API
api:{endpoint}:{params}

// Sessions
session:{sessionId}
```

---

## 🔧 Cache Configuration

Edit `lib/cache/config.ts`:

```typescript
export const CACHE_CONFIG = {
  enabled: process.env.CACHE_ENABLED === 'true',
  defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10),

  // TTL for different data types
  ttl: {
    user: 3600,        // 1 hour
    product: 7200,     // 2 hours
    order: 1800,       // 30 minutes
    session: 86400,    // 24 hours
    api: 300,          // 5 minutes
    query: 600,        // 10 minutes
    static: 604800,    // 1 week
  },
};
```

---

## 📊 Cache Management API

### Get Cache Statistics

```bash
GET /api/cache/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "stats": {
      "hits": 1234,
      "misses": 456,
      "sets": 789,
      "deletes": 12,
      "hitRate": 73.01
    },
    "memory": {
      "used": "12.5MB",
      "peak": "15.2MB",
      "fragmentation": "1.12"
    },
    "backend": "redis",
    "isRedisAvailable": true
  }
}
```

### Clear Cache

```bash
POST /api/cache/clear
Content-Type: application/json

{
  "pattern": "user:*"  // Optional: clear specific pattern
  "tag": "products"    // Optional: clear by tag
}
```

---

## 🎯 Cache Strategies

### 1. Cache-Aside (Lazy Loading)

```typescript
async function getProduct(id: number) {
  const key = `product:${id}`;

  // Try cache
  let product = await cache.get(key);

  if (!product) {
    // Cache miss - fetch from DB
    const { data } = await supabase
      .from('produk')
      .select('*')
      .eq('id', id)
      .single();

    product = data;

    // Store in cache
    await cache.set(key, product, { ttl: 3600 });
  }

  return product;
}
```

### 2. Write-Through

```typescript
async function updateProduct(id: number, updates: any) {
  // Update database
  const { data } = await supabase
    .from('produk')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  // Update cache
  const key = `product:${id}`;
  await cache.set(key, data, { ttl: 3600 });

  // Invalidate related caches
  await cache.invalidateByTag('products');

  return data;
}
```

### 3. Write-Behind (Async Update)

```typescript
async function incrementViewCount(productId: number) {
  const key = `product:${productId}:views`;

  // Increment in cache immediately
  await cache.increment(key);

  // Queue database update (implement with job queue)
  // This is just a concept
  await queueJob('update-view-count', { productId });
}
```

### 4. Cache Warming

```typescript
// Warm up cache on application start
async function warmUpCache() {
  const supabase = createClient();

  // Fetch popular products
  const { data: products } = await supabase
    .from('produk')
    .select('*')
    .limit(100);

  const entries = products?.map((product) => ({
    key: `product:${product.id}`,
    value: product,
    ttl: 7200,
  })) || [];

  await cache.warmUp(entries);
}
```

---

## ⚡ Performance Tips

### 1. Use Appropriate TTL

- **Static data** (categories, settings): 1 week
- **Semi-static** (products): 2-4 hours
- **Dynamic** (user data): 30 mins - 1 hour
- **Real-time** (stock, prices): 1-5 minutes

### 2. Cache Tagging

```typescript
await cache.set('product:123', product, {
  ttl: 3600,
  tags: ['products', 'product:123', 'category:electronics'],
});

// Invalidate all products
await cache.invalidateByTag('products');

// Invalidate specific product
await cache.invalidateByTag('product:123');

// Invalidate category
await cache.invalidateByTag('category:electronics');
```

### 3. Batch Operations

```typescript
// Fetch multiple keys at once
const [user, profile, orders] = await cache.mget([
  'user:123',
  'user:123:profile',
  'user:123:orders',
]);

// Set multiple keys at once
await cache.mset([
  { key: 'user:123', value: userData, ttl: 3600 },
  { key: 'user:123:profile', value: profileData, ttl: 3600 },
]);
```

### 4. Stale-While-Revalidate

```typescript
const { data } = useCachedQuery(
  'produk',
  (query) => query.select('*'),
  {
    customTTL: 300,           // Cache for 5 minutes
    refetchInterval: 60000,   // Revalidate every 60 seconds
  }
);
```

---

## 🐛 Troubleshooting

### Redis Connection Issues

```typescript
// Check Redis connection
import { getRedisClient } from '@/lib/cache/redis-client';

const redis = getRedisClient();
const isPing = await redis.ping();

console.log('Redis available:', isPing);
```

### Cache Miss Rate Too High

1. Check TTL settings - may be too short
2. Monitor cache eviction
3. Increase Redis memory limit
4. Review cache key patterns

### Memory Issues

```typescript
// Get memory stats
const stats = await getRedisClient().getMemoryStats();
console.log('Memory used:', stats.used);
console.log('Memory peak:', stats.peak);
```

---

## 📈 Monitoring

### Cache Hit Rate

```typescript
const stats = cache.getStats();
console.log('Hit rate:', stats.hitRate.toFixed(2) + '%');
console.log('Hits:', stats.hits);
console.log('Misses:', stats.misses);
```

### Redis Memory Usage

```bash
# In Redis CLI
INFO memory
```

---

## 🔒 Security Considerations

1. **Never cache sensitive data without encryption**
2. **Always validate user permissions before returning cached data**
3. **Use cache tags to prevent data leakage between users**
4. **Implement cache key namespacing per tenant**

---

## 📚 File Structure

```
lib/
├── cache/
│   ├── config.ts              # Cache configuration
│   ├── redis-client.ts        # Redis client with pooling
│   ├── memory.ts              # In-memory fallback
│   ├── cache-service.ts       # Main cache service
│   └── cached-supabase.ts     # Supabase query wrappers
├── hooks/
│   └── useCachedQuery.ts      # React hooks for caching
└── utils/
    └── cache-helpers.ts       # Helper functions

app/
└── api/
    ├── cache/
    │   ├── stats/route.ts     # Cache statistics
    │   └── clear/route.ts     # Clear cache
    └── revalidate/route.ts    # Next.js revalidation
```

---

## ✅ Testing

```typescript
// Test cache functionality
import { cache } from '@/lib/cache/cache-service';

async function testCache() {
  // Set
  await cache.set('test:key', { value: 'test' }, { ttl: 60 });

  // Get
  const data = await cache.get('test:key');
  console.log('Cached data:', data);

  // Delete
  await cache.delete('test:key');

  // Verify deletion
  const deleted = await cache.get('test:key');
  console.log('Should be null:', deleted);
}
```

---

**Status:** ✅ Fully Implemented
**Last Updated:** 2025-11-06
