import { getStripe } from '../config/stripe.js';
import { query } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import type { VirtualCardRow } from '../types/index.js';

export async function createCard(
  userId: string,
  spendingLimitAmount?: number,
  spendingLimitInterval?: string,
): Promise<VirtualCardRow> {
  const stripe = getStripe();

  // Get or create Stripe customer
  const subs = await query('SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1', [userId]);
  const sub = (subs as any[])[0] as { stripe_customer_id: string | null } | undefined;
  let customerId = sub?.stripe_customer_id;

  if (!customerId) {
    const user = await query('SELECT email FROM users WHERE id = $1', [userId]);
    const u = (user as any[])[0];
    const customer = await stripe.customers.create({
      email: u.email,
      metadata: { user_id: userId },
    });
    customerId = customer.id;
    await query('UPDATE subscriptions SET stripe_customer_id = $1 WHERE user_id = $2', [customerId, userId]);
  }

  // Create issuing card
  const card = await stripe.issuing.cards.create({
    type: 'virtual',
    currency: 'usd',
    cardholder: await getOrCreateCardholder(userId, customerId),
    spending_controls: spendingLimitAmount ? {
      spending_limits: [{
        amount: spendingLimitAmount,
        interval: (spendingLimitInterval as any) || 'monthly',
      }],
    } : undefined,
    status: 'active',
  });

  const results = await query(
    `INSERT INTO virtual_cards (user_id, stripe_card_id, last_four, brand, status,
                                spending_limit_amount, spending_limit_interval)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, card.id, card.last4, card.brand, 'active',
     spendingLimitAmount || null, spendingLimitInterval || null],
  );

  return (results as any[])[0] as VirtualCardRow;
}

async function getOrCreateCardholder(userId: string, customerId: string) {
  const stripe = getStripe();

  // Check if cardholder already exists
  const cardholders = await stripe.issuing.cardholders.list({ limit: 10 });
  const existing = cardholders.data.find(ch => ch.metadata?.user_id === userId);
  if (existing) return existing.id;

  const user = await query('SELECT email, display_name FROM users WHERE id = $1', [userId]);
  const u = (user as any[])[0];

  const cardholder = await stripe.issuing.cardholders.create({
    type: 'individual',
    name: u.display_name || u.email.split('@')[0],
    email: u.email,
    status: 'active',
    billing: {
      address: {
        line1: '123 Main St',  // Would need real address collection
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US',
      },
    },
    metadata: { user_id: userId },
  });

  return cardholder.id;
}

export async function listCards(userId: string): Promise<VirtualCardRow[]> {
  const results = await query(
    `SELECT * FROM virtual_cards
     WHERE user_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [userId],
  );
  return results as VirtualCardRow[];
}

export async function updateCard(
  userId: string,
  cardId: string,
  updates: { status?: 'active' | 'frozen'; spending_limit_amount?: number; spending_limit_interval?: string },
): Promise<VirtualCardRow> {
  // Update in Stripe
  const card = await query('SELECT stripe_card_id FROM virtual_cards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [cardId, userId]);
  const existing = (card as any[])[0] as { stripe_card_id: string } | undefined;
  if (!existing) throw new NotFoundError('Card');

  const stripe = getStripe();
  if (updates.status) {
    await stripe.issuing.cards.update(existing.stripe_card_id, {
      status: updates.status === 'frozen' ? 'frozen' : 'active',
    });
  }

  // Update in DB
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (updates.status) { fields.push(`status = $${idx++}`); values.push(updates.status); }
  if (updates.spending_limit_amount !== undefined) { fields.push(`spending_limit_amount = $${idx++}`); values.push(updates.spending_limit_amount); }
  if (updates.spending_limit_interval !== undefined) { fields.push(`spending_limit_interval = $${idx++}`); values.push(updates.spending_limit_interval); }
  fields.push('updated_at = NOW()');

  values.push(cardId, userId);
  const results = await query(
    `UPDATE virtual_cards SET ${fields.join(', ')}
     WHERE id = $${idx++} AND user_id = $${idx} AND deleted_at IS NULL
     RETURNING *`,
    values,
  );
  const updated = (results as any[])[0] as VirtualCardRow | undefined;
  if (!updated) throw new NotFoundError('Card');
  return updated;
}

export async function deleteCard(userId: string, cardId: string): Promise<void> {
  const results = await query(
    `UPDATE virtual_cards SET deleted_at = NOW(), status = 'canceled'
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
     RETURNING id`,
    [cardId, userId],
  );
  if ((results as any[]).length === 0) throw new NotFoundError('Card');
}