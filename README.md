# Toma - Platform Agregator Bahan Baku Organik B2B

Platform B2B agregator bahan baku organik yang menghubungkan petani organik bersertifikat dengan sektor komersial melalui rantai pasok yang transparan dan terverifikasi.

## Overview

**PT. Toma Organik Solusi** adalah platform digital B2B yang menyediakan ekosistem lengkap untuk perdagangan bahan baku organik bersertifikat. Platform ini menggabungkan transparansi, kualitas, dan keberlanjutan dalam satu sistem terintegrasi.

**Tagline:** _"Bahan Baku Organik Terbaik, Kunci Kepercayaan Pelanggan Anda"_

**Nilai Utama:** Transparansi · Kualitas · Keberlanjutan

### Misi Platform
- Menghubungkan petani organik bersertifikat dengan buyer B2B
- Menyediakan sistem rantai pasok yang transparan dan terverifikasi
- Memastikan 100% sertifikasi organik untuk setiap produk
- Memberikan edukasi pertanian organik kepada mitra
- Memfasilitasi transaksi B2B yang efisien dan terpercaya

## Fitur Utama

### 1. Halaman Publik

#### Landing Page & Brand
- **Homepage** - Hero dengan animasi morphing background dan parallax effects
- **Statistics Section** - Animated counter (500+ Petani Mitra, 50+ Jenis Produk, 99% Organik Bersertifikat)
- **Features Showcase** - 6 fitur unggulan dengan 3D tilt cards:
  - Edukasi Pertanian Organik
  - Katalog Bahan Baku Bersertifikat
  - Laporan Rantai Pasok Transparan
  - Sistem Poin Loyalitas
  - Pengingat Panen & Pemesanan
  - Tracking Resi Real-Time

#### Profil Perusahaan (`/profil`)
- Visi, Misi, dan Nilai Perusahaan
- Komitmen terhadap keberlanjutan
- Sertifikasi dan standar kualitas

#### Brand Identity (`/brand`)
- Informasi brand Toma Organik Solusi
- Standar kualitas profesional B2B
- Nilai-nilai perusahaan

#### Social Media (`/social-media`)
- Tautan ke media sosial dengan liquid hover effect
- Instagram: @TomaOrganikID
- LinkedIn: Toma Organik Solusi
- YouTube: TomaOrganikID
- Twitter/X: @TomaB2B

#### Authentication
- **Login** (`/login`) - Email/password dan Google OAuth
- **Register** (`/register`) - Pendaftaran supplier/klien baru

### 2. Dashboard Mitra (Protected Routes)

#### Manajemen Profil & Dashboard
- **Dashboard Beranda** (`/mitra/beranda`) - Overview performa bisnis
- **Profil Mitra** (`/mitra/profil`) - Kelola informasi akun

#### E-Commerce & Supply Chain
- **Katalog Produk** (`/mitra/katalog`) - Browse bahan baku organik dengan filter
- **Kelola Pesanan** (`/mitra/order`) - Histori dan status pesanan
- **Update Resi** (`/mitra/update-resi`) - Tracking pengiriman real-time
- **Tagihan** (`/mitra/tagihan`) - Invoice dan pembayaran
- **Laporan Penjualan** (`/mitra/total-penjualan`) - Analytics penjualan

#### Loyalty & Rewards
- **Sistem Poin** (`/mitra/poin`) - Akumulasi poin dari transaksi
- **Hadiah** (`/mitra/hadiah`) - Reward eksklusif untuk mitra

#### Komunikasi & Notifikasi
- **Chat** (`/mitra/chat`) - Komunikasi real-time dengan Socket.IO
- **Pengingat** (`/mitra/pengingat`) - Notifikasi panen, pesanan, promo
- **Notifications** (`/mitra/notifications`) - Push notifications & real-time updates

#### Edukasi
- **Kelas Video** (`/mitra/kelas`) - Pelatihan pertanian organik
- **Sertifikasi** - Program sertifikasi organik

### 3. Admin Dashboard (Protected Routes)

#### User Management
- **User Management** (`/admin/users`) - Kelola pengguna dan roles
- **Role-Based Access Control (RBAC)** - Permission management

#### System Performance
- **Performance Monitoring** (`/admin/performance`) - Web vitals analytics
- **Cache Management** (`/admin/cache`) - Redis cache statistics & clear

## Tech Stack

### Frontend Framework & Library
- **Next.js 16.0.1** - React framework dengan App Router dan Server Components
- **React 19.2.0** - Library UI dengan React Server Components
- **TypeScript 5** - Type-safe JavaScript development
- **Framer Motion 12.23.24** - Advanced animations (morphing, parallax, 3D tilt, liquid fill)

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom Design System**:
  - Primary: `#1A4D2E` (Forest Green)
  - Secondary: `#A8C69F` (Sage Green)
  - Accent: `#B8873B` (Bronze), `#8B4513` (Saddle Brown)
  - Background: `#f1f8ed` (Light Green Tint)
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants management
- **clsx & tailwind-merge** - Conditional styling utilities

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - `@supabase/supabase-js` - JavaScript client
  - `@supabase/ssr` - Server-side rendering support
- **PostgreSQL** - Relational database (via Supabase)

### Authentication & Authorization
- **Supabase Auth** - Authentication service
  - Email/Password authentication
  - Google OAuth integration
  - Cookie-based session management
  - Middleware-based route protection
- **RBAC System** - Custom role-based access control
  - User roles and permissions
  - Protected API routes

### Real-time Features
- **Socket.IO 4.8.1** - WebSocket server & client
  - Real-time chat
  - Live notifications
  - Order updates
- **Supabase Realtime** - Database subscriptions
  - Live data synchronization
  - Push notifications

### Caching & Performance
- **Redis (ioredis 5.8.2)** - Distributed caching
  - Query result caching
  - Session storage
  - Cache invalidation strategies
- **Memory Cache** - In-memory fallback caching
- **Next.js Caching** - ISR and revalidation

### Payment Integration
- **Midtrans** - Payment gateway
  - Transaction creation
  - Payment notifications
  - Status tracking

### Form Management & Validation
- **React Hook Form 7.66.0** - Form state management
- **@hookform/resolvers** - Validation resolver
- **Zod 4.1.12** - Schema validation library

### State Management
- **Zustand 5.0.8** - Lightweight state management

### Fonts
- **Montserrat** - Primary font (400, 500, 600, 700)
- **Lato** - Body font (400, 700)

### Development Tools
- **ESLint 9** - Code linting dengan Next.js config
- **PostCSS** - CSS processing
- **Next.js Dev Server** - Hot reload development

## Project Structure

```
laili/
├── app/
│   ├── (public routes)
│   │   ├── page.tsx                 # Homepage/Landing
│   │   ├── profil/                  # Company profile
│   │   ├── brand/                   # Brand identity
│   │   ├── social-media/            # Social links
│   │   ├── login/                   # Login page
│   │   └── register/                # Registration
│   │
│   ├── mitra/                       # Partner dashboard (protected)
│   │   ├── beranda/                 # Dashboard home
│   │   ├── profil/                  # Profile management
│   │   ├── katalog/                 # Product catalog
│   │   ├── order/                   # Order management
│   │   ├── update-resi/             # Shipment tracking
│   │   ├── tagihan/                 # Invoices
│   │   ├── total-penjualan/         # Sales reports
│   │   ├── poin/                    # Loyalty points
│   │   ├── hadiah/                  # Rewards
│   │   ├── kelas/                   # Video classes
│   │   ├── pengingat/               # Reminders
│   │   ├── chat/                    # Real-time chat
│   │   └── notifications/           # Notifications
│   │
│   ├── admin/                       # Admin dashboard (protected)
│   │   ├── users/                   # User management
│   │   ├── performance/             # Performance monitoring
│   │   └── cache/                   # Cache management
│   │
│   ├── api/                         # API routes
│   │   ├── payment/                 # Payment endpoints
│   │   ├── cache/                   # Cache management
│   │   ├── admin/                   # Admin APIs
│   │   ├── analytics/               # Web vitals
│   │   └── revalidate/              # Cache revalidation
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
│
├── components/
│   ├── Navigation.tsx               # Main navigation
│   ├── Footer.tsx                   # Footer component
│   ├── Logo.tsx                     # Logo component
│   ├── ProtectedRoute.tsx           # Route protection
│   ├── NotificationBell.tsx         # Notification UI
│   ├── PushNotificationPrompt.tsx   # Push notifications
│   ├── OptimizedImage.tsx           # Image optimization
│   └── WebVitalsReporter.tsx        # Performance tracking
│
├── lib/
│   ├── supabase/                    # Supabase clients
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── middleware.ts            # Auth middleware
│   │
│   ├── cache/                       # Caching system
│   │   ├── redis.ts                 # Redis setup
│   │   ├── memory.ts                # Memory cache
│   │   ├── cache-service.ts         # Cache service
│   │   └── cached-supabase.ts       # Cached queries
│   │
│   ├── socket/                      # Real-time
│   │   ├── server.ts                # Socket.IO server
│   │   └── client.ts                # Socket.IO client
│   │
│   ├── notifications/               # Notification system
│   │   ├── types.ts                 # Type definitions
│   │   ├── realtime.ts              # Realtime updates
│   │   └── push.ts                  # Push notifications
│   │
│   ├── midtrans/                    # Payment
│   │   ├── config.ts                # Midtrans config
│   │   └── types.ts                 # Payment types
│   │
│   ├── rbac/                        # Authorization
│   │   ├── permissions.ts           # Permission definitions
│   │   └── middleware.ts            # RBAC middleware
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useCache.ts              # Cache hook
│   │   ├── useCachedQuery.ts        # Cached queries
│   │   ├── usePayment.ts            # Payment hook
│   │   ├── useSimplePayment.ts      # Simple payment
│   │   ├── useNotifications.ts      # Notifications
│   │   ├── useChat.ts               # Chat functionality
│   │   └── usePermissions.ts        # RBAC permissions
│   │
│   ├── performance/                 # Performance
│   │   └── web-vitals.ts            # Web vitals tracking
│   │
│   ├── types/                       # TypeScript types
│   │   └── database.ts              # Database types
│   │
│   └── utils/                       # Utilities
│       ├── utils.ts                 # General utilities
│       └── image-upload.ts          # Image handling
│
├── public/
│   ├── LogoToma.png                 # Company logo (favicon)
│   └── sw.js                        # Service worker
│
├── middleware.ts                    # Next.js middleware
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
└── tsconfig.json                    # TypeScript configuration
```

## Key Features Deep Dive

### 1. Advanced Animations & Interactions
- **Morphing Backgrounds** - SVG path animations with Framer Motion
- **Parallax Effects** - Scroll-based transformations
- **3D Tilt Cards** - Interactive feature cards with depth
- **Liquid Fill Effects** - Smooth background transitions on hover
- **Animated Counters** - View-triggered number animations
- **Shimmer Effects** - Gradient overlay animations

### 2. Real-time Capabilities
- **Live Chat** - Socket.IO powered messaging
- **Push Notifications** - Browser notifications for updates
- **Realtime Database** - Supabase subscriptions
- **Order Tracking** - Live shipment updates
- **Notification Bell** - Real-time notification center

### 3. Performance Optimization
- **Redis Caching** - Distributed cache for queries
- **Memory Cache Fallback** - In-memory caching when Redis unavailable
- **ISR & Revalidation** - Incremental Static Regeneration
- **Web Vitals Monitoring** - Performance analytics
- **Optimized Images** - Next.js Image optimization
- **Code Splitting** - Automatic route-based splitting

### 4. Security & Authorization
- **RBAC System** - Role-based permissions
- **Protected Routes** - Middleware authentication
- **Secure Sessions** - Cookie-based auth
- **API Protection** - Server-side validation
- **SQL Injection Prevention** - Parameterized queries

### 5. Payment Integration
- **Midtrans Gateway** - Secure payment processing
- **Transaction Tracking** - Payment status monitoring
- **Webhook Handling** - Payment notifications
- **Invoice Generation** - Automatic billing

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis (Optional - falls back to memory cache)
REDIS_URL=your_redis_url

# Midtrans Payment
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Supabase account
- Redis (optional, for production caching)
- Midtrans account (for payment features)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd laili
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Database Schema

### Main Tables
- **users** - User accounts and profiles
- **products** - Organic product catalog
- **orders** - Order management
- **payments** - Payment transactions
- **notifications** - User notifications
- **chat_messages** - Chat history
- **classes** - Video classes/courses
- **points** - Loyalty points system
- **rewards** - Reward items
- **shipments** - Tracking information

### RBAC Tables
- **roles** - User roles
- **permissions** - System permissions
- **role_permissions** - Role-permission mappings
- **user_roles** - User-role assignments

## API Routes

### Public APIs
- `POST /api/payment/create-transaction` - Create payment
- `POST /api/payment/notification` - Payment webhook
- `GET /api/payment/status` - Check payment status

### Protected APIs (Admin)
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `GET /api/admin/roles` - List roles
- `POST /api/admin/permissions` - Manage permissions
- `PUT /api/admin/users/[userId]/roles` - Assign roles

### System APIs
- `GET /api/cache/stats` - Cache statistics
- `POST /api/cache/clear` - Clear cache
- `POST /api/revalidate` - Revalidate cache
- `POST /api/analytics/web-vitals` - Report web vitals

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-dark: #1A4D2E;      /* Forest Green */
--primary-darker: #12331c;     /* Darker Forest */

/* Secondary Colors */
--secondary: #A8C69F;          /* Sage Green */
--secondary-light: #f1f8ed;    /* Light Green Tint */

/* Accent Colors */
--accent-bronze: #B8873B;      /* Bronze */
--accent-brown: #8B4513;       /* Saddle Brown */

/* Background */
--bg-gradient: from-white via-[#f1f8ed] to-white;
```

### Typography
- **Headings**: Montserrat (600, 700)
- **Body**: Lato (400), Montserrat (400, 500)
- **Display**: Montserrat (700)

### Component Library
- Animated cards with hover effects
- Gradient buttons with transitions
- Form inputs with validation states
- Modals and overlays
- Navigation with responsive design
- Footer with social links

## Responsiveness & Accessibility

### Mobile-First Design
- Optimized for mobile devices (320px+)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized UI elements
- Swipe gestures support

### Accessibility Features
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators
- Alt text for images

### Internationalization
- Full Bahasa Indonesia localization
- Currency formatting (IDR/Rupiah)
- Date/time localization
- Number formatting

## Performance Benchmarks

### Target Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 600ms

### Optimization Strategies
- Server Components by default
- Dynamic imports for heavy components
- Image optimization with Next/Image
- Font optimization with next/font
- Cache-first strategies
- Lazy loading for below-fold content

## Deployment

### Recommended Platforms
- **Vercel** - Optimized for Next.js (recommended)
- **Railway** - With Redis support
- **AWS** - EC2/ECS with RDS and ElastiCache
- **Digital Ocean** - App Platform

### Environment Setup
1. Set all environment variables in platform
2. Configure Redis connection (or use memory cache)
3. Set up Supabase connection
4. Configure Midtrans credentials
5. Set production URL

### Post-Deployment Checklist
- [ ] Verify Supabase connection
- [ ] Test authentication flow
- [ ] Check payment integration
- [ ] Verify Redis/cache functionality
- [ ] Test real-time features
- [ ] Monitor performance metrics
- [ ] Check error logging

## Browser Support

### Desktop
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Mobile
- iOS Safari 14+ ✅
- Chrome Android 90+ ✅
- Samsung Internet 14+ ✅

## Contributing

This is a private commercial project for PT. Toma Organik Solusi. For internal development guidelines, please refer to the internal documentation.

## License

Proprietary - All rights reserved by PT. Toma Organik Solusi

## Support & Contact

For support or inquiries:
- Website: [Your Website URL]
- Email: [contact@tomaorganik.com]
- Instagram: [@TomaOrganikID](https://instagram.com/TomaOrganikID)
- LinkedIn: [Toma Organik Solusi](https://linkedin.com/company/toma-organik-solusi)
- YouTube: [@TomaOrganikID](https://youtube.com/@TomaOrganikID)
- Twitter/X: [@TomaB2B](https://twitter.com/TomaB2B)

---

**Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, and Redis**

_Version: 0.1.0_
