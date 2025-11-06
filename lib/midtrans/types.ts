// Midtrans Transaction Types
export interface MidtransCustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  billing_address?: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
  shipping_address?: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
}

export interface MidtransItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchant_name?: string;
}

export interface MidtransTransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface MidtransSnapParameter {
  transaction_details: MidtransTransactionDetails;
  item_details?: MidtransItemDetails[];
  customer_details?: MidtransCustomerDetails;
  enabled_payments?: string[];
  credit_card?: {
    secure?: boolean;
    bank?: string;
    installment?: {
      required: boolean;
      terms?: {
        [key: string]: number[];
      };
    };
    whitelist_bins?: string[];
  };
  bca_va?: {
    va_number?: string;
  };
  bni_va?: {
    va_number?: string;
  };
  bri_va?: {
    va_number?: string;
  };
  permata_va?: {
    va_number?: string;
  };
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
  expiry?: {
    start_time?: string;
    unit?: 'second' | 'minute' | 'hour' | 'day';
    duration?: number;
  };
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
}

export interface MidtransNotification {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'failure';
  fraud_status?: 'accept' | 'deny' | 'challenge';
  approval_code?: string;
  signature_key: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  payment_amounts?: Array<{
    paid_at: string;
    amount: string;
  }>;
  bill_key?: string;
  biller_code?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'expired';

export interface Transaction {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  status: PaymentStatus;
  payment_type: string | null;
  transaction_id: string | null;
  snap_token: string | null;
  snap_redirect_url: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
