import { NextRequest, NextResponse } from 'next/server';
import { coreApi } from '@/lib/midtrans/config';
import { MidtransNotification } from '@/lib/midtrans/types';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Verify Midtrans signature
function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string
): string {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  return hash;
}

export async function POST(request: NextRequest) {
  try {
    const notification: MidtransNotification = await request.json();

    console.log('Midtrans notification received:', notification);

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const expectedSignature = verifySignature(
      notification.order_id,
      notification.status_code,
      notification.gross_amount,
      serverKey
    );

    if (notification.signature_key !== expectedSignature) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Get transaction status from Midtrans
    const statusResponse = await coreApi.transaction.status(notification.order_id);

    // Map Midtrans status to our status
    let paymentStatus: string;
    switch (statusResponse.transaction_status) {
      case 'capture':
        paymentStatus = statusResponse.fraud_status === 'accept' ? 'success' : 'pending';
        break;
      case 'settlement':
        paymentStatus = 'success';
        break;
      case 'pending':
        paymentStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        paymentStatus = statusResponse.transaction_status;
        break;
      case 'failure':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'pending';
    }

    // Update transaction in database
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: paymentStatus,
        payment_type: statusResponse.payment_type,
        transaction_id: statusResponse.transaction_id,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', notification.order_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    // If payment is successful, update order status
    if (paymentStatus === 'success') {
      // Get transaction details to get user_id
      const { data: transaction } = await supabase
        .from('transactions')
        .select('user_id, metadata')
        .eq('order_id', notification.order_id)
        .single();

      if (transaction) {
        // Create order or update order status
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: transaction.user_id,
            status: 'active',
          });

        if (orderError) {
          console.error('Order creation error:', orderError);
        }

        // TODO: Send notification to user
        // TODO: Update inventory/stock
        // TODO: Send email confirmation
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process notification' },
      { status: 500 }
    );
  }
}
