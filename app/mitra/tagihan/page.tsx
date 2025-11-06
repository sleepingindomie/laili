'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePayment } from '@/lib/hooks/usePayment';
import { useRouter, useSearchParams } from 'next/navigation';

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
  };
}

function TagihanContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSnapPayment, isLoading: paymentLoading } = usePayment({
    onSuccess: (orderId) => {
      console.log('Payment success:', orderId);
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

  const handleTestPayment = async () => {
    try {
      await openSnapPayment([
        {
          id: 'ITEM-001',
          name: 'Produk Test',
          price: 100000,
          quantity: 1,
        },
      ]);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const totalPending = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      pending: 'Menunggu',
      success: 'Berhasil',
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

  return (
    <div className="container-responsive py-8">
      {showSuccess && (
        <div className="mb-6 rounded-xl bg-green-100 border border-green-400 p-4 text-green-700">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Pembayaran berhasil!</span>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Tagihan</h1>
        <button
          onClick={handleTestPayment}
          disabled={paymentLoading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
