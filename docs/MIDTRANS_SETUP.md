# Midtrans Payment Gateway Setup Guide

## 📦 Fitur yang Tersedia

✅ Snap Payment UI (Popup pembayaran yang responsif)
✅ Multiple payment methods (Credit Card, Virtual Account, E-Wallet, QRIS)
✅ Transaction tracking & status management
✅ Payment notification webhook
✅ Secure payment flow dengan signature verification
✅ Transaction history di halaman tagihan

---

## 🚀 setup Instructions

### 1. Dapatkan Midtrans Credentials

1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Pilih environment:
   - **Sandbox** untuk testing
   - **Production** untuk live environment
3. Copy credentials:
   - Server Key
   - Client Key

### 2. Update Environment Variables

Edit file `.env.local` dan isi dengan credentials Anda:

```env
# Midtrans Configuration
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx

# Application URL (penting untuk callback)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Penting:**
- Set `MIDTRANS_IS_PRODUCTION=false` untuk testing
- Set `MIDTRANS_IS_PRODUCTION=true` untuk production
- Ganti Server Key dan Client Key dengan milik Anda

### 3. Jalankan Migration Database

Jalankan SQL migration untuk membuat tabel `transactions`:

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buka project Anda
3. Masuk ke **SQL Editor**
4. Copy isi file `supabase/migrations/001_create_transactions_table.sql`
5. Paste dan jalankan

Atau gunakan Supabase CLI:

```bash
supabase db push
```

### 4. Setup Webhook Notification

1. Login ke Midtrans Dashboard
2. Buka **Settings** → **Configuration**
3. Set **Payment Notification URL**:
   ```
   https://your-domain.com/api/payment/notification
   ```
4. Untuk development lokal, gunakan tool seperti [ngrok](https://ngrok.com/):
   ```bash
   ngrok http 3000
   ```
   Kemudian set notification URL ke `https://your-ngrok-url/api/payment/notification`

---

## 💻 Cara Menggunakan

### Test Pembayaran

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Login ke aplikasi

3. Buka halaman **Tagihan** (`/mitra/tagihan`)

4. Klik tombol **"Test Pembayaran"**

5. Popup Snap akan muncul dengan berbagai metode pembayaran

6. Untuk testing, gunakan test credentials dari [Midtrans Sandbox](https://docs.midtrans.com/docs/testing-payment-on-sandbox)

### Test Cards (Sandbox)

**Sukses:**
- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Expiry: `01/25`

**Gagal:**
- Card Number: `4911 1111 1111 1113`
- CVV: `123`
- Expiry: `01/25`

### Implementasi di Kode Anda

```tsx
'use client';

import { usePayment } from '@/lib/hooks/usePayment';

export default function MyComponent() {
  const { openSnapPayment, isLoading } = usePayment({
    onSuccess: (orderId) => {
      console.log('Payment success!', orderId);
      // Redirect atau update UI
    },
    onError: (error) => {
      console.error('Payment failed:', error);
    },
  });

  const handleCheckout = async () => {
    await openSnapPayment([
      {
        id: 'PROD-001',
        name: 'Produk A',
        price: 100000,
        quantity: 2,
      },
      {
        id: 'PROD-002',
        name: 'Produk B',
        price: 50000,
        quantity: 1,
      },
    ]);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Bayar Sekarang'}
    </button>
  );
}
```

---

## 📁 File Structure

```
lib/
├── midtrans/
│   ├── config.ts           # Midtrans client configuration
│   └── types.ts            # TypeScript types & interfaces
├── hooks/
│   └── usePayment.ts       # React hook untuk payment
└── types/
    └── database.ts         # Database types (+ transactions table)

app/
└── api/
    └── payment/
        ├── create-transaction/
        │   └── route.ts    # Create Snap transaction
        ├── notification/
        │   └── route.ts    # Webhook handler
        └── status/
            └── route.ts    # Check payment status

supabase/
└── migrations/
    └── 001_create_transactions_table.sql
```

---

## 🔒 Security Features

✅ **Signature Verification** - Semua webhook diverifikasi dengan SHA512 signature
✅ **Row Level Security (RLS)** - User hanya bisa akses transaksi sendiri
✅ **Server-side Processing** - Sensitive operations di server
✅ **Environment Variables** - Credentials tidak di-hardcode

---

## 🎯 Payment Flow

1. **User klik bayar** → `usePayment.openSnapPayment()`
2. **Create transaction** → API `/api/payment/create-transaction`
3. **Get Snap token** → Midtrans Snap API
4. **Open popup** → Snap.js payment UI
5. **User bayar** → Pilih metode & konfirmasi
6. **Midtrans callback** → User redirect ke `/mitra/tagihan?status=success`
7. **Webhook notification** → `/api/payment/notification` (async)
8. **Update database** → Status transaksi terupdate
9. **Show confirmation** → UI update dengan status terbaru

---

## 🧪 Testing Checklist

- [ ] Test payment dengan berbagai metode (CC, VA, E-Wallet)
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test payment expiry
- [ ] Test webhook notification
- [ ] Test transaction history
- [ ] Test unauthorized access (RLS)
- [ ] Test production environment

---

## 📚 Resources

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Snap API Reference](https://snap-docs.midtrans.com/)
- [Testing Payment](https://docs.midtrans.com/docs/testing-payment-on-sandbox)
- [Midtrans Dashboard](https://dashboard.midtrans.com/)

---

## ❓ Troubleshooting

### Payment popup tidak muncul
- Pastikan Snap.js script ter-load
- Check console untuk error
- Verify `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` sudah benar

### Webhook tidak jalan
- Pastikan notification URL sudah di-set di dashboard
- Untuk local dev, gunakan ngrok
- Check signature verification

### Transaction tidak tersimpan
- Check Supabase connection
- Verify tabel `transactions` sudah ada
- Check RLS policies

---

**Status:** ✅ Fully Implemented
**Last Updated:** 2025-11-06
