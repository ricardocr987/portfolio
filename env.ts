import { Connection } from "@solana/web3.js";

const isProduction = process.env.ENVIRONMENT === 'prod';

const stripeConfig = {
  STRIPE_SECRET_KEY: isProduction
    ? process.env.STRIPE_LIVE_SECRET_KEY || ''
    : process.env.STRIPE_SECRET_KEY || '',
  PRICE_ID: process.env.PRICE_ID || '',
};

const appConfig = {
  APP_URL: isProduction ? process.env.APP_URL : 'https://localhost:3000',
};

const config = {
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  SOL_CONNECTION: new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || ''),
  ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
  ...stripeConfig,
  ...appConfig,
};

export default config;
