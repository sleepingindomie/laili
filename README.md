# Laili Brand - Platform Kemitraan Wanita

Platform B2B kemitraan berbasis web yang dirancang khusus untuk memberdayakan wanita membangun bisnis dari rumah. Sistem manajemen kemitraan lengkap dengan fitur e-commerce, edukasi, reward, dan analitik bisnis.

## Overview

**Laili Brand** adalah platform digital yang menyediakan ekosistem lengkap bagi mitra wanita untuk menjalankan bisnis dari rumah. Platform ini menggabungkan sistem penjualan produk, pembelajaran online, reward poin, dan manajemen bisnis dalam satu aplikasi yang terintegrasi.

**Tagline:** _"Dunianya wanita berkarir dari rumah"_

### Tujuan Platform
- Memberdayakan wanita untuk membangun karir dan bisnis dari rumah
- Menyediakan sistem kemitraan yang transparan dan mudah dikelola
- Memberikan edukasi bisnis melalui kelas video dan coaching
- Memotivasi mitra dengan sistem reward dan poin
- Memfasilitasi transaksi dan manajemen pesanan yang efisien

## Fitur Utama

### 1. Halaman Publik
- **Landing Page** - Tampilan utama dengan 6 fitur unggulan platform
- **Login & Register** - Autentikasi dengan email/password dan Google OAuth
- **Profil Perusahaan** - Visi, misi, nilai, dan benefit bergabung
- **Brand Page** - Informasi brand Laili
- **Social Media** - Tautan media sosial perusahaan

### 2. Dashboard Mitra (Protected Routes)

#### Manajemen Profil & Akun
- **Profil Mitra** - Kelola informasi pribadi (nama, telepon, alamat)
- **Dashboard** - Ringkasan performa (penjualan, poin, pesanan, kelas)

#### E-Commerce & Penjualan
- **Katalog Produk** - Browse produk dengan fitur pencarian dan filter kategori
- **Kelola Pesanan** - Histori pesanan dengan status (pending, processing, completed)
- **Update Resi** - Tracking dan update status pengiriman
- **Tagihan** - Lihat invoice dan informasi pembayaran
- **Laporan Penjualan** - Monitor total penjualan dan performa

#### Edukasi & Pembelajaran
- **Kelas Video** - Akses kelas online dengan instruktur
- **Coaching Schedule** - Jadwal coaching dengan waktu dan pembicara
- **Pengingat** - Notifikasi jadwal coaching, promo, dan update sistem

## Tech Stack

### Frontend Framework & Library
- **Next.js 16.0.1** - React framework dengan App Router dan Server Components
- **React 19.2.0** - Library UI dengan React Server Components
- **TypeScript 5** - Type-safe JavaScript untuk development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom CSS Variables** - Brand colors (accent-warm, accent-darker, accent-cream, primary-700)
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants management
- **clsx & tailwind-merge** - Conditional styling utilities

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - `@supabase/supabase-js` - JavaScript client
  - `@supabase/ssr` - Server-side rendering support
- **PostgreSQL** - Database (via Supabase)

### Authentication
- **Supabase Auth** - Authentication service
  - Email/Password authentication
  - Google OAuth integration
  - Cookie-based session management
  - Middleware-based route protection

### Form Management & Validation
- **React Hook Form 7.66.0** - Form state management
- **@hookform/resolvers** - Validation resolver untuk React Hook Form
- **Zod 4.1.12** - Schema validation library

### State Management
- **Zustand 5.0.8** - Lightweight state management

### Fonts
- **Cinzel Decorative** - Display font (400, 700, 900)
- **Libre Baskerville** - Body font (400, 700)

### Development Tools
- **ESLint** - Code linting dengan Next.js config
- **PostCSS** - CSS processing
- **Next.js Dev Server** - Hot reload development

## Responsiveness & Accessibility

- **Mobile-First Design** - Optimized untuk mobile devices
- **Responsive Components** - Flexbox dan grid layout yang adaptive
- **Touch Targets** - Minimum 48x48px untuk touch areas
- **Semantic HTML** - Accessible markup structure
- **Bahasa Indonesia** - Full localization dalam Bahasa Indonesia
- **Currency Formatting** - Format mata uang Rupiah (IDR)

**Built using Next.js, React, TypeScript, and Supabase**
