import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { query } from '../config/database.js';
import { AppError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors.js';
import type { JwtPayload, PlanTier, AuthResponse, UserRow, SubscriptionRow } from '../types/index.js';

/**
 * Generate an email verification token and store it.
 */
export async function sendVerificationEmail(userId: string): Promise<{ token: string }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await query(
    `UPDATE users SET email_verified_at = NULL WHERE id = $1`,
    [userId],
  );

  // Store token — we use a simple approach: store in a verification_tokens table
  // For simplicity, embed in JWT
  const verificationToken = jwt.sign(
    { sub: userId, purpose: 'email-verify' },
    config.jwtSecret,
    { expiresIn: '24h' },
  );

  // In production, send email via SendGrid/Resend here
  console.log(`[EMAIL VERIFICATION] User ${userId}: token=${verificationToken}`);

  return { token: verificationToken };
}

/**
 * Verify email using the verification token.
 */
export async function verifyEmail(token: string): Promise<void> {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string; purpose: string };
    if (payload.purpose !== 'email-verify') {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid verification token');
    }

    const results = await query(
      `UPDATE users SET email_verified_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND email_verified_at IS NULL
       RETURNING id`,
      [payload.sub],
    );

    if ((results as any[]).length === 0) {
      throw new AppError(400, 'ALREADY_VERIFIED', 'Email is already verified or user not found');
    }
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw new AppError(400, 'TOKEN_EXPIRED', 'Verification link has expired. Request a new one.');
    }
    throw new AppError(400, 'INVALID_TOKEN', 'Invalid verification token');
  }
}

/**
 * Initiate password reset — generate reset token.
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const users = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = (users as any[])[0];

  // Always return success to prevent email enumeration
  if (!user) {
    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  const resetToken = jwt.sign(
    { sub: user.id, purpose: 'password-reset' },
    config.jwtSecret,
    { expiresIn: '1h' },
  );

  // In production, send email via SendGrid/Resend here
  console.log(`[PASSWORD RESET] User ${user.id}: token=${resetToken}`);

  return { message: 'If an account with that email exists, a reset link has been sent.' };
}

/**
 * Reset password using a valid reset token.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string; purpose: string };
    if (payload.purpose !== 'password-reset') {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);

    await query(
      `UPDATE users SET password_hash = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id`,
      [passwordHash, payload.sub],
    );
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw new AppError(400, 'TOKEN_EXPIRED', 'Reset link has expired. Request a new one.');
    }
    throw new AppError(400, 'INVALID_TOKEN', 'Invalid reset token');
  }
}

export async function signup(email: string, password: string, displayName?: string): Promise<AuthResponse> {
  // Check existing user
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if ((existing as any[]).length > 0) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

  // Create user
  const users = await query(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, email_verified_at, created_at`,
    [email.toLowerCase(), passwordHash, displayName || null],
  );
  const user = (users as any[])[0] as UserRow;

  // Create free subscription
  await query(
    `INSERT INTO subscriptions (user_id, plan_tier, status)
     VALUES ($1, 'free', 'active')`,
    [user.id],
  );

  // Create initial usage record
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  await query(
    `INSERT INTO usage_records (user_id, billing_period_start, billing_period_end)
     VALUES ($1, $2, $3)`,
    [user.id, periodStart, periodEnd],
  );

  // Auto-send verification email
  await sendVerificationEmail(user.id);

  return generateAuthResponse(user, 'free');
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const users = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = (users as any[])[0] as UserRow | undefined;

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const subs = await query(
    'SELECT plan_tier FROM subscriptions WHERE user_id = $1 AND status = $2',
    [user.id, 'active'],
  );
  const sub = (subs as any[])[0] as SubscriptionRow | undefined;
  const tier = sub?.plan_tier || 'free';

  return generateAuthResponse(user, tier);
}

function generateAuthResponse(user: UserRow, planTier: string): AuthResponse {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    tier: planTier as PlanTier,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn as any });

  return {
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      plan_tier: planTier as PlanTier,
    },
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export function refreshAccessToken(refreshToken: string): string {
  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as JwtPayload;
    const { sub, email, tier } = payload;
    return jwt.sign({ sub, email, tier }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

export async function getProfile(userId: string) {
  const results = await query(
    `SELECT u.id, u.email, u.display_name, u.email_verified_at, u.created_at,
            s.plan_tier, s.status as subscription_status
     FROM users u
     LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
     WHERE u.id = $1`,
    [userId],
  );
  const user = (results as any[])[0];
  if (!user) throw new NotFoundError('User');
  return user;
}

export async function updateProfile(userId: string, updates: { display_name?: string; email?: string }) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (updates.display_name !== undefined) {
    fields.push(`display_name = $${idx++}`);
    values.push(updates.display_name);
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(updates.email.toLowerCase());
  }

  if (fields.length === 0) {
    return { message: 'No changes' };
  }

  fields.push('updated_at = NOW()');
  values.push(userId);

  const results = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, display_name`,
    values,
  );
  return { user: (results as any[])[0] };
}