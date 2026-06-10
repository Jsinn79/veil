import Stripe from 'stripe';
import { config } from './index.js';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(config.stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return stripeClient;
}