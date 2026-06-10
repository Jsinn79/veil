import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { createCheckoutSession, handleStripeWebhook } from '../services/subscription.service.js';
import { query } from '../config/database.js';

const router = Router();

// Get current subscription + usage
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subs = await query(
      `SELECT s.*, u.aliases_created, u.phone_numbers_rented, u.cards_created, u.sms_received
       FROM subscriptions s
       LEFT JOIN usage_records u ON u.user_id = s.user_id
         AND u.billing_period_start = (
           SELECT billing_period_start FROM usage_records
           WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
         )
       WHERE s.user_id = $1`,
      [req.user!.sub],
    );

    res.json({ subscription: (subs as any[])[0] || null });
  } catch (err) {
    next(err);
  }
});

// Create Stripe checkout session
router.post('/checkout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tier } = req.body; // 'basic' or 'pro'
    if (!tier || !['basic', 'pro'].includes(tier)) {
      return res.status(400).json({ error: { code: 'INVALID_TIER', message: 'Tier must be "basic" or "pro"' } });
    }
    const result = await createCheckoutSession(req.user!.sub, tier);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Stripe webhook (raw body needed — configured in app.ts)
router.post('/webhooks/stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const result = await handleStripeWebhook(
      JSON.stringify(req.body),
      signature,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;