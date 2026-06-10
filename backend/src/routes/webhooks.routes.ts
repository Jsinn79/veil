import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../config/database.js';
import { handleStripeWebhook } from '../services/subscription.service.js';

const router = Router();

// Stripe webhook (raw body provided by app.ts middleware at /api/webhooks/stripe)
router.post('/stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    // req.body is a Buffer when raw body parser is used
    const body = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);
    const result = await handleStripeWebhook(body, signature);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Twilio inbound SMS webhook
router.post('/twilio', async (req: Request, res: Response) => {
  try {
    const { From, To, Body, MessageSid } = req.body;

    // Find the phone number in our DB
    const numbers = await query(
      'SELECT id FROM phone_numbers WHERE phone_number = $1 AND is_active = true',
      [To],
    );
    const number = (numbers as any[])[0];

    if (number) {
      await query(
        `INSERT INTO message_logs (phone_number_id, from_number, to_number, body, direction, twilio_sid)
         VALUES ($1, $2, $3, $4, 'inbound', $5)`,
        [number.id, From, To, Body, MessageSid],
      );
    }

    // Respond to Twilio with empty message (no auto-reply)
    res.type('text/xml').send('<Response></Response>');
  } catch (err) {
    console.error('Twilio webhook error:', err);
    res.type('text/xml').send('<Response></Response>');
  }
});

// Email forwarding webhook (from SendGrid/Postal)
router.post('/email', async (req: Request, res: Response) => {
  try {
    const { to, from, subject } = req.body;

    // Parse alias from recipient
    const aliasParts = to?.split('@')[0];
    if (!aliasParts) {
      return res.status(200).json({ status: 'ignored' });
    }

    // Find alias
    const aliases = await query(
      `SELECT * FROM email_aliases
       WHERE alias = $1 AND is_active = true AND deleted_at IS NULL`,
      [`${aliasParts}@${process.env.EMAIL_DOMAIN || 'veilmail.io'}`],
    );
    const alias = (aliases as any[])[0];

    if (alias) {
      await query(
        `INSERT INTO email_forwarding_logs (alias_id, from_address, to_address, subject, status)
         VALUES ($1, $2, $3, $4, 'forwarded')`,
        [alias.id, from, alias.forwarding_address, subject],
      );
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Email webhook error:', err);
    res.json({ status: 'ok' });
  }
});

export default router;