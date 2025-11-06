import { CoreApi, Snap } from 'midtrans-client';

// Midtrans Configuration
export const midtransConfig = {
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
};

// Core API Client (for direct API calls)
export const coreApi = new CoreApi({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey,
});

// Snap API Client (for Snap payment UI)
export const snap = new Snap({
  isProduction: midtransConfig.isProduction,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey,
});
