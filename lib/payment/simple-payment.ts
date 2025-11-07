/**
 * Simple Payment System (Replacement for Midtrans)
 * Manual payment simulation tanpa payment gateway eksternal
 */

export type PaymentMethod =
  | 'bank_transfer'
  | 'cash'
  | 'e_wallet'
  | 'qris';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'expired';

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  items: PaymentItem[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaymentInstructions {
  method: PaymentMethod;
  accountNumber?: string;
  accountName?: string;
  qrCode?: string;
  instructions: string[];
  expiryTime: string;
}

/**
 * Generate order ID
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${random}`;
}

/**
 * Get payment instructions based on method
 */
export function getPaymentInstructions(
  orderId: string,
  amount: number,
  method: PaymentMethod
): PaymentInstructions {
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  switch (method) {
    case 'bank_transfer':
      return {
        method: 'bank_transfer',
        accountNumber: '1234567890',
        accountName: 'LAILI BRAND',
        instructions: [
          'Transfer ke rekening BCA: 1234567890',
          'Atas nama: LAILI BRAND',
          `Jumlah transfer: Rp ${amount.toLocaleString('id-ID')}`,
          'Sertakan kode unik di akhir transfer (opsional)',
          'Simpan bukti transfer',
          'Upload bukti transfer setelah pembayaran',
        ],
        expiryTime,
      };

    case 'cash':
      return {
        method: 'cash',
        instructions: [
          'Bayar secara tunai saat pengambilan produk',
          `Total yang harus dibayar: Rp ${amount.toLocaleString('id-ID')}`,
          'Siapkan uang pas untuk mempercepat proses',
          'Tunjukkan order ID saat pembayaran',
          `Order ID: ${orderId}`,
        ],
        expiryTime,
      };

    case 'e_wallet':
      return {
        method: 'e_wallet',
        accountNumber: '081234567890',
        instructions: [
          'Transfer via E-Wallet (OVO/GoPay/Dana)',
          'Nomor tujuan: 081234567890',
          'Atas nama: LAILI BRAND',
          `Jumlah transfer: Rp ${amount.toLocaleString('id-ID')}`,
          'Screenshot bukti pembayaran',
          'Upload bukti transfer setelah pembayaran',
        ],
        expiryTime,
      };

    case 'qris':
      return {
        method: 'qris',
        qrCode: 'https://via.placeholder.com/300x300?text=QRIS+Code',
        instructions: [
          'Scan QR Code dengan aplikasi pembayaran Anda',
          `Total pembayaran: Rp ${amount.toLocaleString('id-ID')}`,
          'Pastikan jumlah yang dibayar sesuai',
          'Screenshot bukti pembayaran',
          'Upload bukti setelah pembayaran berhasil',
        ],
        expiryTime,
      };

    default:
      throw new Error('Payment method not supported');
  }
}

/**
 * Calculate total amount from items
 */
export function calculateTotal(items: PaymentItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Validate payment amount
 */
export function validatePayment(amount: number): boolean {
  return amount > 0 && amount < 1000000000; // Max 1 billion
}

/**
 * Format currency to IDR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
