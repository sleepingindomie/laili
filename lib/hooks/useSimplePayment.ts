/**
 * React Hook for Simple Payment
 */

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  PaymentMethod,
  PaymentItem,
  generateOrderId,
  getPaymentInstructions,
  calculateTotal,
  validatePayment,
} from '@/lib/payment/simple-payment';

interface UseSimplePaymentOptions {
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export function useSimplePayment(options?: UseSimplePaymentOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  /**
   * Create payment transaction
   */
  const createPayment = async (
    items: PaymentItem[],
    method: PaymentMethod,
    customerDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate total
      const amount = calculateTotal(items);

      // Validate amount
      if (!validatePayment(amount)) {
        throw new Error('Invalid payment amount');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate order ID
      const orderId = generateOrderId();

      // Get payment instructions
      const instructions = getPaymentInstructions(orderId, amount, method);

      // Save to database
      const { data: transaction, error: dbError } = await supabase
        .from('transactions')
        .insert({
          order_id: orderId,
          user_id: user.id,
          amount,
          status: 'pending',
          payment_type: method,
          metadata: {
            items,
            customer: customerDetails,
            instructions,
          },
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Success callback
      options?.onSuccess?.(orderId);

      return {
        success: true,
        orderId,
        transaction,
        instructions,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create payment';
      setError(errorMessage);
      options?.onError?.(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Upload payment proof
   */
  const uploadProof = async (orderId: string, proofFile: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to Supabase Storage
      const fileName = `payment-proof-${orderId}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, proofFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Update transaction with proof URL
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          metadata: {
            proof_url: publicUrl,
            proof_uploaded_at: new Date().toISOString(),
          },
        })
        .eq('order_id', orderId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return {
        success: true,
        proofUrl: publicUrl,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload proof';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark payment as paid (for cash payment)
   */
  const markAsPaid = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('order_id', orderId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to mark as paid';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel payment
   */
  const cancelPayment = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'cancelled',
        })
        .eq('order_id', orderId)
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (updateError) throw updateError;

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel payment';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createPayment,
    uploadProof,
    markAsPaid,
    cancelPayment,
  };
}
