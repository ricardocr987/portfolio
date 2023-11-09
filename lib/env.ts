import { Connection } from "@solana/web3.js";
import { confirmOptions } from "./constants";

const isProduction = process.env.ENVIRONMENT === 'prod';

const stripeConfig = {
  STRIPE_SECRET_KEY: isProduction
    ? process.env.STRIPE_LIVE_SECRET_KEY || ''
    : process.env.STRIPE_SECRET_KEY || '',
  PRICE_ID: process.env.PRICE_ID || '',
  STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY || ''
};

const googleConfig = {
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID || '',
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL || '',
  GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || '',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  auth: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID || '',
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || '',
    private_key: process.env.GOOGLE_PRIVATE_KEY || '',
    client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL || '',
    universe_domain: "googleapis.com"
  },
  oauth: {
    OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
    OAUTH_SECRET: process.env.OAUTH_SECRET || '',
    OAUTH_REFRESH: process.env.OAUTH_REFRESH || '',
  }
};

const config = {
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  SOL_CONNECTION: new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || '', confirmOptions),
  NO_COMMITMENT_SOL_CONNECTION: new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || ''),
  SOLANA_WEBHOOK_AUTH: process.env.SOLANA_WEBHOOK_AUTH || '',
  ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
  APP_URL: isProduction ? process.env.APP_URL : 'http://localhost:3000',
  ...stripeConfig,
  ...googleConfig,
};

export default config;
