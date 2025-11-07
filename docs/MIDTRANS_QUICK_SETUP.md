# 🚀 Midtrans Quick Setup Guide

## Error: "Access denied due to unauthorized transaction"

Ini terjadi karena **Midtrans keys belum diisi** di `.env.local`. Ikuti langkah berikut:

---

## 📝 Step-by-Step Setup

### **1. Daftar Akun Midtrans (Sandbox)**

1. Buka: https://dashboard.midtrans.com/
2. Click **"Sign Up"** atau **"Register"**
3. Isi form pendaftaran:
   - Email
   - Password
   - Nama Lengkap
   - Nomor HP
4. Verifikasi email
5. Login ke dashboard

---

### **2. Pilih Environment: Sandbox (Testing)**

1. Setelah login, pilih **"Sandbox"** environment (kiri atas)
2. Ini untuk testing, **GRATIS** dan tidak perlu dokumen verifikasi

---

### **3. Dapatkan API Keys**

**Di Dashboard Sandbox:**

1. Go to **Settings** → **Access Keys**
2. Copy credentials berikut:

```
Server Key: SB-Mid-server-xxxxxxxxxxxxx
Client Key: SB-Mid-client-xxxxxxxxxxxxx
```

**PENTING:**
- Server Key: **JANGAN** share ke public, ini secret!
- Client Key: Aman untuk frontend

---

### **4. Update `.env.local`**

Buka file `.env.local` di root project dan update:

```env
# Midtrans Configuration
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
```

**Ganti** `xxxxxxxxxxxxx` dengan keys Anda!

---

### **5. Restart Development Server**

```bash
# Stop server (Ctrl + C)
# Start lagi
npm run dev
```

**Environment variables hanya dibaca saat server start!**

---

### **6. Test Pembayaran**

1. Buka: http://localhost:3000/mitra/tagihan
2. Click **"Test Pembayaran"**
3. Snap popup akan muncul
4. Gunakan test credit card:

#### **Test Cards (Sandbox):**

**Sukses:**
```
Card Number: 4811 1111 1111 1114
CVV: 123
Exp: 01/25 (atau bulan/tahun di masa depan)
OTP: 112233
```

**Gagal:**
```
Card Number: 4911 1111 1111 1113
CVV: 123
Exp: 01/25
```

**Lengkapnya:** https://docs.midtrans.com/docs/testing-payment

---

## ✅ Checklist Setup

- [ ] Daftar akun Midtrans Sandbox
- [ ] Login ke dashboard
- [ ] Switch ke Sandbox environment
- [ ] Copy Server Key
- [ ] Copy Client Key
- [ ] Update `.env.local`
- [ ] Restart `npm run dev`
- [ ] Test pembayaran dengan test card

---

## 🔍 Troubleshooting

### **Error: "Access denied"**
- ✅ Check apakah keys sudah diisi di `.env.local`
- ✅ Pastikan tidak ada typo saat copy-paste
- ✅ Pastikan sudah restart server setelah update `.env.local`
- ✅ Pastikan menggunakan Sandbox keys (prefix `SB-Mid-`)

### **Snap popup tidak muncul**
- ✅ Check browser console untuk error
- ✅ Pastikan Client Key sudah benar
- ✅ Clear browser cache

### **Payment tidak berhasil meski pakai test card**
- ✅ Pastikan menggunakan Sandbox environment
- ✅ Cek status di Midtrans Dashboard → Transactions
- ✅ Pastikan OTP diisi: `112233`

---

## 📊 Monitoring Transactions

**Di Midtrans Dashboard:**
1. Go to **Transactions** (sidebar)
2. Lihat semua transaksi testing
3. Filter by status: Success, Pending, Failed
4. Click transaction untuk detail

---

## 🚀 Production Setup (Nanti)

Setelah development selesai:

1. **Verifikasi Akun:**
   - Submit dokumen perusahaan/KTP
   - Tunggu approval (1-3 hari kerja)

2. **Switch ke Production:**
   ```env
   MIDTRANS_IS_PRODUCTION=true
   MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxx
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxx
   ```

3. **Setup Webhook:**
   - Midtrans Dashboard → Settings → Configuration
   - Notification URL: `https://your-domain.com/api/payment/notification`
   - HTTP Method: POST

---

## 📚 Referensi

- **Midtrans Dashboard:** https://dashboard.midtrans.com/
- **Documentation:** https://docs.midtrans.com/
- **Test Cards:** https://docs.midtrans.com/docs/testing-payment
- **API Reference:** https://api-docs.midtrans.com/

---

**Setup selesai? Test pembayaran sekarang!** 🎉
