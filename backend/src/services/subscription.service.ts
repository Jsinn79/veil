import { getStripe } from '../config/stripe.js';
import { query } from '../config/database.js';
import { config } from '../config/index.js';
import { AppError, NotFoundError } from '../utils/errors.js';
import type { PlanTier, SubscriptionRow } from '../types/index.js';

const STRIPE_PRICE_IDS: Record<string, string> = {
  // These would be set via environment variables or fetched from Stripe
  basic: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
};

export async function createCheckoutSession(userId: string, priceTier: 'basic' | 'pro') {
  const stripe = getStripe();
  const priceId = STRIPE_PRICE_IDS[priceTier];
  if (!priceId) {
    throw new AppError(400, 'INVALID_TIER', `Invalid plan tier: ${priceTier}`);
  }

  // Get or create Stripe customer
  const subs = await query('SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1', [userId]);
  const sub = (subs as any[])[0] as SubscriptionRow | undefined;
  let customerId = sub?.stripe_customer_id;

  if (!customerId) {
    const user = await query('SELECT email, display_name FROM users WHERE id = $1', [userId]);
    const u = (user as any[])[0];
    const customer = await stripe.customers.create({
      email: u.email,
      name: u.display_name || undefined,
      metadata: { user_id: userId },
    });
    customerId = customer.id;
    await query(
      'UPDATE subscriptions SET stripe_customer_id = $1 WHERE user_id = $2',
      [customerId, userId],
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${config.frontendUrl}/dashboard?success=true`,
    cancel_url: `${config.frontendUrl}/pricing?canceled=true`,
    metadata: { user_id: userId },
  });

  return { url: session.url };
}

export async function handleStripeWebhook(body: string, signature: string) {
  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret);
  } catch (err) {
    throw new AppError(400, 'WEBHOOK_SIGNATURE_INVALID', 'Invalid webhook signature');
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (userId && session.subscription) {
        await query(
          `UPDATE subscriptions
           SET stripe_subscription_id = $1, status = 'active',
               plan_tier = CASE
                 WHEN $2 LIKE '%basic%' THEN 'basic'
                 WHEN $2 LIKE '%pro%' THEN 'pro'
                 ELSE plan_tier
               END
           WHERE user_id = $3`,
          [session.subscription, '', userId],
        );
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'past_due' ? 'past_due'
        : 'canceled';
      await query(
        `UPDATE subscriptions
         SET status = $1, current_period_start = $2, current_period_end = $3
         WHERE stripe_subscription_id = $4`,
        [status,
         new Date(subscription.current_period_start * 1000).toISOString(),
         new Date(subscription.current_period_end * 1000).toISOString(),
         subscription.id],
      );
      break;
    }
  }

  return { received: true };
}