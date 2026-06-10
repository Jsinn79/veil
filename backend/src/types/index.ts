// ─── Plan Tiers ─────────────────────────────────────────────
export enum PlanTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
}

export interface PlanLimits {
  aliasesPerMonth: number;
  phoneNumbersPerMonth: number;
  cardsPerMonth: number;
  smsPerMonth: number;
  aliasForwarding: boolean;
  prioritySupport: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  [PlanTier.FREE]: {
    aliasesPerMonth: 5,
    phoneNumbersPerMonth: 0,
    cardsPerMonth: 0,
    smsPerMonth: 0,
    aliasForwarding: true,
    prioritySupport: false,
  },
  [PlanTier.BASIC]: {
    aliasesPerMonth: 50,
    phoneNumbersPerMonth: 1,
    cardsPerMonth: 3,
    smsPerMonth: 50,
    aliasForwarding: true,
    prioritySupport: false,
  },
  [PlanTier.PRO]: {
    aliasesPerMonth: Infinity,
    phoneNumbersPerMonth: 3,
    cardsPerMonth: 10,
    smsPerMonth: 500,
    aliasForwarding: true,
    prioritySupport: true,
  },
};

// ─── Database Row Types ─────────────────────────────────────
export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan_tier: PlanTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailAliasRow {
  id: string;
  user_id: string;
  alias: string;
  display_name: string | null;
  forwarding_address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PhoneNumberRow {
  id: string;
  user_id: string;
  phone_number: string;
  twilio_sid: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  released_at: string | null;
}

export interface VirtualCardRow {
  id: string;
  user_id: string;
  stripe_card_id: string;
  last_four: string;
  brand: string;
  status: 'active' | 'frozen' | 'canceled';
  spending_limit_amount: number | null;
  spending_limit_interval: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UsageRecordRow {
  id: string;
  user_id: string;
  billing_period_start: string;
  billing_period_end: string;
  aliases_created: number;
  phone_numbers_rented: number;
  cards_created: number;
  sms_received: number;
  created_at: string;
}

export interface MessageLogRow {
  id: string;
  phone_number_id: string;
  from_number: string;
  to_number: string;
  body: string | null;
  direction: 'inbound' | 'outbound';
  twilio_sid: string | null;
  created_at: string;
}

// ─── API Request/Response Types ─────────────────────────────
export interface SignupRequest {
  email: string;
  password: string;
  display_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    display_name: string | null;
    plan_tier: PlanTier;
  };
  access_token: string;
  refresh_token: string;
}

export interface CreateAliasRequest {
  forwarding_address: string;
  display_name?: string;
}

export interface CreatePhoneNumberRequest {
  area_code?: string;
  label?: string;
}

export interface CreateCardRequest {
  display_name?: string;
  spending_limit_amount?: number;
  spending_limit_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface UpdateCardRequest {
  status?: 'active' | 'frozen';
  spending_limit_amount?: number;
  spending_limit_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── JWT Payload ────────────────────────────────────────────
export interface JwtPayload {
  sub: string;   // user_id
  email: string;
  tier: PlanTier;
  iat?: number;
  exp?: number;
}