/**
 * Type declarations for midtrans-client
 */

declare module 'midtrans-client' {
  export interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  export interface ItemDetails {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  export interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      postal_code?: string;
      country_code?: string;
    };
    shipping_address?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      postal_code?: string;
      country_code?: string;
    };
  }

  export interface SnapParameter {
    transaction_details: TransactionDetails;
    item_details?: ItemDetails[];
    customer_details?: CustomerDetails;
    enabled_payments?: string[];
    credit_card?: {
      secure?: boolean;
      bank?: string;
      installment?: {
        required?: boolean;
        terms?: {
          [bank: string]: number[];
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
      recipient_name?: string;
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

  export interface SnapResponse {
    token: string;
    redirect_url: string;
  }

  export interface TransactionStatusResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
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
    masked_card?: string;
    currency?: string;
  }

  export class Snap {
    constructor(config: MidtransConfig);
    createTransaction(parameter: SnapParameter): Promise<SnapResponse>;
    transaction: {
      status(orderId: string): Promise<TransactionStatusResponse>;
      cancel(orderId: string): Promise<any>;
      approve(orderId: string): Promise<any>;
      deny(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
      refund(orderId: string, parameter?: any): Promise<any>;
    };
  }

  export class CoreApi {
    constructor(config: MidtransConfig);
    charge(parameter: any): Promise<any>;
    capture(parameter: any): Promise<any>;
    cardRegister(parameter: any): Promise<any>;
    cardToken(parameter: any): Promise<any>;
    cardPointInquiry(tokenId: string): Promise<any>;
    transaction: {
      status(orderId: string): Promise<TransactionStatusResponse>;
      statusb2b(orderId: string): Promise<any>;
      approve(orderId: string): Promise<any>;
      deny(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
      refund(orderId: string, parameter?: any): Promise<any>;
      refundDirect(orderId: string, parameter?: any): Promise<any>;
      notification(notification: any): Promise<TransactionStatusResponse>;
    };
  }

  export interface ApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }
}
