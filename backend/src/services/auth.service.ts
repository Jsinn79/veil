import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../config/database.js';
import { AppError, ConflictError, UnauthorizedError } from '../utils/errors.js';
import type { JwtPayload, PlanTier, AuthResponse, UserRow, SubscriptionRow } from '../types/index.js';

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

export function refreshAccessToken(refreshToken: string): AuthResponse['access_token'] {
  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as JwtPayload;
    const { sub, email, tier } = payload;
    return jwt.sign({ sub, email, tier }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}