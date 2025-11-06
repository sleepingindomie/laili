import { useState } from 'react';
import { MidtransItemDetails, MidtransCustomerDetails } from '@/lib/midtrans/types';

interface UsePaymentOptions {
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  onPending?: (orderId: string) => void;
}

export function usePayment(options?: UsePaymentOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (
    items: MidtransItemDetails[],
    customerDetails?: MidtransCustomerDetails
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer_details: customerDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create transaction';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const openSnapPayment = async (
    items: MidtransItemDetails[],
    customerDetails?: MidtransCustomerDetails
  ) => {
    try {
      const { snap_token, order_id } = await createTransaction(items, customerDetails);

      // Load Snap.js if not already loaded
      if (!(window as any).snap) {
        await loadSnapScript();
      }

      // Open Snap payment page
      (window as any).snap.pay(snap_token, {
        onSuccess: function (result: any) {
          console.log('Payment success:', result);
          options?.onSuccess?.(order_id);
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
          options?.onPending?.(order_id);
        },
        onError: function (result: any) {
          console.log('Payment error:', result);
          const errorMessage = 'Payment failed';
          setError(errorMessage);
          options?.onError?.(errorMessage);
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });
    } catch (err: any) {
      console.error('Payment error:', err);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/payment/status?order_id=${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check payment status');
      }

      return data.transaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to check payment status';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    createTransaction,
    openSnapPayment,
    checkPaymentStatus,
    isLoading,
    error,
  };
}

// Helper function to load Snap.js script
function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Snap.js'));
    document.body.appendChild(script);
  });
}
