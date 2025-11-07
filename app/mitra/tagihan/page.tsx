'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSimplePayment } from '@/lib/hooks/useSimplePayment';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentMethod, getPaymentInstructions } from '@/lib/payment/simple-payment';
import { X, Copy, Check } from 'lucide-react';

interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_type: string | null;
  created_at: string;
  metadata?: {
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    instructions?: any;
  };
}

function TagihanContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { createPayment, isLoading: paymentLoading } = useSimplePayment({
    onSuccess: (orderId) => {
      console.log('Payment created:', orderId);
      setShowMethodModal(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        fetchTransactions();
      }, 3000);
    },
    onError: (error) => {
      console.error('Payment error:', error);
      alert(`Pembayaran gagal: ${error}`);
    },
  });

  useEffect(() => {
    fetchTransactions();

    // Check for payment callback
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');

    if (status && orderId) {
      if (status === 'success') {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.replace('/mitra/tagihan');
          fetchTransactions();
        }, 3000);
      }
    }
  }, [searchParams]);

  const fetchTransactions = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    try {
      const result = await createPayment(
        [
          {
            id: 'ITEM-001',
            name: 'Produk Test',
            price: 100000,
            quantity: 1,
          },
        ],
        method,
        {
          name: 'Test User',
          email: 'test@example.com',
          phone: '081234567890',
        }
      );

      if (result.success && result.instructions) {
        setSelectedInstructions(result.instructions);
        setShowInstructionsModal(true);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleViewInstructions = (transaction: Transaction) => {
    if (transaction.metadata?.instructions) {
      setSelectedInstructions(transaction.metadata.instructions);
      setShowInstructionsModal(true);
    } else {
      // Generate instructions if not saved
      const instructions = getPaymentInstructions(
        transaction.order_id,
        transaction.amount,
        transaction.payment_type as PaymentMethod
      );
      setSelectedInstructions(instructions);
      setShowInstructionsModal(true);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const totalPending = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      pending: 'Menunggu',
      paid: 'Dibayar',
      failed: 'Gagal',
      expired: 'Kadaluarsa',
      cancelled: 'Dibatalkan',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentMethods = [
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Transfer Bank',
      icon: '🏦',
      description: 'BCA, Mandiri, BNI, BRI',
    },
    {
      id: 'e_wallet' as PaymentMethod,
      name: 'E-Wallet',
      icon: '💳',
      description: 'GoPay, OVO, DANA, ShopeePay',
    },
    {
      id: 'qris' as PaymentMethod,
      name: 'QRIS',
      icon: '📱',
      description: 'Scan QR dengan aplikasi favorit',
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Cash',
      icon: '💵',
      description: 'Bayar langsung ke mitra',
    },
  ];

  return (
    <div className="container-responsive py-8">
      {showSuccess && (
        <div className="mb-6 rounded-xl bg-green-100 border border-green-400 p-4 text-green-700">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Pembayaran berhasil dibuat! Silakan lanjutkan pembayaran sesuai instruksi.</span>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Tagihan</h1>
        <button
          onClick={() => setShowMethodModal(true)}
          disabled={paymentLoading}
          className="px-6 py-2 bg-gradient-to-r from-[#B8873B] to-[#8B4513] text-white rounded-lg hover:shadow-lg hover:from-[#936c2f] hover:to-[#703710] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {paymentLoading ? 'Memproses...' : 'Test Pembayaran'}
        </button>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Total Tagihan Menunggu</h2>
          <span className="text-3xl font-bold text-purple-600">
            {formatCurrency(totalPending)}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {transactions.filter((t) => t.status === 'pending').length} tagihan menunggu pembayaran
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Riwayat Transaksi</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2">Memuat data...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4">Belum ada transaksi</p>
            <p className="text-sm mt-2">Klik tombol "Test Pembayaran" untuk mencoba</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {transaction.order_id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>

                {transaction.metadata?.items && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">Item:</p>
                    <ul className="space-y-1">
                      {transaction.metadata.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {item.name} - {item.quantity}x {formatCurrency(item.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {transaction.payment_type && (
                      <p className="text-sm text-gray-600">
                        Metode: <span className="font-medium capitalize">{transaction.payment_type.replace('_', ' ')}</span>
                      </p>
                    )}
                    {transaction.status === 'pending' && (
                      <button
                        onClick={() => handleViewInstructions(transaction)}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                      >
                        Lihat Instruksi Pembayaran
                      </button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Pilih Metode Pembayaran</h2>
              <button
                onClick={() => setShowMethodModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                  disabled={paymentLoading}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-4xl mb-3">{method.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Instructions Modal */}
      {showInstructionsModal && selectedInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Instruksi Pembayaran</h2>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Order ID:</strong> {selectedInstructions.orderId}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Total:</strong> {selectedInstructions.displayAmount}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Metode:</strong> {selectedInstructions.method === 'bank_transfer' ? 'Transfer Bank' :
                                            selectedInstructions.method === 'e_wallet' ? 'E-Wallet' :
                                            selectedInstructions.method === 'qris' ? 'QRIS' : 'Cash'}
                </p>
              </div>

              {/* Bank Transfer Instructions */}
              {selectedInstructions.method === 'bank_transfer' && selectedInstructions.bankAccounts && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Pilih Bank:</h3>
                  {selectedInstructions.bankAccounts.map((bank: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{bank.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nomor Rekening:</span>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                              {bank.accountNumber}
                            </code>
                            <button
                              onClick={() => copyToClipboard(bank.accountNumber, `bank-${idx}`)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {copiedText === `bank-${idx}` ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Atas Nama:</span> <span className="font-medium">{bank.accountName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* E-Wallet Instructions */}
              {selectedInstructions.method === 'e_wallet' && selectedInstructions.eWallets && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Pilih E-Wallet:</h3>
                  {selectedInstructions.eWallets.map((wallet: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{wallet.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nomor:</span>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                            {wallet.number}
                          </code>
                          <button
                            onClick={() => copyToClipboard(wallet.number, `wallet-${idx}`)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {copiedText === `wallet-${idx}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* QRIS Instructions */}
              {selectedInstructions.method === 'qris' && (
                <div className="text-center">
                  <div className="inline-block p-6 bg-gray-100 rounded-lg mb-4">
                    <div className="text-6xl">📱</div>
                    <p className="mt-4 text-sm text-gray-600">
                      Scan QR Code dengan aplikasi pembayaran favorit Anda
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    (Dalam implementasi real, QR code akan ditampilkan di sini)
                  </p>
                </div>
              )}

              {/* Cash Instructions */}
              {selectedInstructions.method === 'cash' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    Silakan bayar langsung ke mitra atau admin kami dengan menunjukkan Order ID ini.
                  </p>
                </div>
              )}

              {/* Steps */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Langkah Pembayaran:</h3>
                <ol className="space-y-2">
                  {selectedInstructions.steps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold mr-3">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {selectedInstructions.expiryTime && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>⏰ Batas Waktu:</strong> {selectedInstructions.expiryTime}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Selesaikan pembayaran sebelum batas waktu berakhir
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B8873B] to-[#8B4513] text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TagihanPage() {
  return (
    <Suspense fallback={
      <div className="container-responsive py-8">
        <div className="text-center py-12 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2">Memuat halaman...</p>
        </div>
      </div>
    }>
      <TagihanContent />
    </Suspense>
  );
}
