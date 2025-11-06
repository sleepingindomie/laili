import { NextRequest, NextResponse } from 'next/server';
import { snap } from '@/lib/midtrans/config';
import { MidtransSnapParameter } from '@/lib/midtrans/types';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, customer_details } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Calculate gross amount
    const gross_amount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Generate unique order ID
    const order_id = `ORDER-${Date.now()}-${uuidv4().substring(0, 8)}`;

    // Prepare Snap parameter
    const parameter: MidtransSnapParameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      item_details: items,
      customer_details: customer_details || {
        first_name: user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        phone: customer_details?.phone || '08123456789',
      },
      enabled_payments: [
        'credit_card',
        'bca_va',
        'bni_va',
        'bri_va',
        'permata_va',
        'other_va',
        'gopay',
        'shopeepay',
        'qris',
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/mitra/tagihan?order_id=${order_id}&status=success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/mitra/tagihan?order_id=${order_id}&status=error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/mitra/tagihan?order_id=${order_id}&status=pending`,
      },
      expiry: {
        unit: 'hour',
        duration: 24,
      },
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(parameter);

    // Save transaction to database
    const { error: dbError } = await supabase
      .from('transactions')
      .insert({
        order_id,
        user_id: user.id,
        amount: gross_amount,
        status: 'pending',
        snap_token: transaction.token,
        snap_redirect_url: transaction.redirect_url,
        metadata: {
          items,
          customer_details,
        },
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id,
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
