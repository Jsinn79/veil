import { query } from '../config/database.js';
import type { UsageRecordRow } from '../types/index.js';

export async function getCurrentUsage(userId: string): Promise<UsageRecordRow | null> {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const results = await query(
    `SELECT * FROM usage_records
     WHERE user_id = $1 AND billing_period_start = $2`,
    [userId, periodStart],
  );
  return (results as any[])[0] as UsageRecordRow | null;
}

export async function incrementUsage(
  userId: string,
  field: 'aliases_created' | 'phone_numbers_rented' | 'cards_created' | 'sms_received',
): Promise<void> {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  await query(
    `INSERT INTO usage_records (user_id, billing_period_start, billing_period_end, ${field})
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (user_id, billing_period_start)
     DO UPDATE SET ${field} = usage_records.${field} + 1`,
    [userId, periodStart, periodEnd],
  );
}

export async function getUsageForPeriod(userId: string, startDate: string, endDate: string): Promise<UsageRecordRow | null> {
  const results = await query(
    `SELECT * FROM usage_records
     WHERE user_id = $1 AND billing_period_start >= $2 AND billing_period_end <= $3`,
    [userId, startDate, endDate],
  );
  return (results as any[])[0] as UsageRecordRow | null;
}