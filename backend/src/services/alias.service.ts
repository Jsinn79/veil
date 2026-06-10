import { query } from '../config/database.js';
import { config } from '../config/index.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import type { EmailAliasRow } from '../types/index.js';
import crypto from 'crypto';

function generateAlias(userId: string): string {
  const shortId = crypto.createHash('md5').update(userId).digest('hex').slice(0, 8);
  const random = crypto.randomBytes(4).toString('hex');
  return `${shortId}_${random}@${config.emailDomain}`;
}

export async function createAlias(userId: string, forwardingAddress: string, displayName?: string): Promise<EmailAliasRow> {
  const alias = generateAlias(userId);

  const results = await query(
    `INSERT INTO email_aliases (user_id, alias, forwarding_address, display_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, alias, forwardingAddress, displayName || null],
  );

  return (results as any[])[0] as EmailAliasRow;
}

export async function listAliases(userId: string): Promise<EmailAliasRow[]> {
  const results = await query(
    `SELECT * FROM email_aliases
     WHERE user_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [userId],
  );
  return results as EmailAliasRow[];
}

export async function getAlias(userId: string, aliasId: string): Promise<EmailAliasRow> {
  const results = await query(
    `SELECT * FROM email_aliases WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [aliasId, userId],
  );
  const alias = (results as any[])[0] as EmailAliasRow | undefined;
  if (!alias) throw new NotFoundError('Alias');
  return alias;
}

export async function updateAlias(
  userId: string,
  aliasId: string,
  updates: { forwarding_address?: string; display_name?: string; is_active?: boolean },
): Promise<EmailAliasRow> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (updates.forwarding_address !== undefined) {
    fields.push(`forwarding_address = $${idx++}`);
    values.push(updates.forwarding_address);
  }
  if (updates.display_name !== undefined) {
    fields.push(`display_name = $${idx++}`);
    values.push(updates.display_name);
  }
  if (updates.is_active !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(updates.is_active);
  }

  if (fields.length === 0) throw new NotFoundError('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(aliasId, userId);

  const results = await query(
    `UPDATE email_aliases SET ${fields.join(', ')}
     WHERE id = $${idx++} AND user_id = $${idx} AND deleted_at IS NULL
     RETURNING *`,
    [...values],
  );
  const alias = (results as any[])[0] as EmailAliasRow | undefined;
  if (!alias) throw new NotFoundError('Alias');
  return alias;
}

export async function deleteAlias(userId: string, aliasId: string): Promise<void> {
  const results = await query(
    `UPDATE email_aliases SET deleted_at = NOW(), is_active = false
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
     RETURNING id`,
    [aliasId, userId],
  );
  if ((results as any[]).length === 0) throw new NotFoundError('Alias');
}