/**
 * Drizzle ORM schema for Veil.
 * Defines all PostgreSQL tables with relationships and types.
 */
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ── Users ──────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 100 }),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── Subscriptions ──────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  planTier: varchar('plan_tier', { length: 20 }).notNull().default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_subscriptions_user_id').on(table.userId),
  stripeCustomerIdx: index('idx_subscriptions_stripe_customer').on(table.stripeCustomerId),
  userUniqueIdx: uniqueIndex('idx_subscriptions_user_unique').on(table.userId),
}));

// ── Email Aliases ──────────────────────────────────────────
export const emailAliases = pgTable('email_aliases', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  alias: varchar('alias', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  forwardingAddress: varchar('forwarding_address', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  userIdIdx: index('idx_aliases_user_id').on(table.userId),
  aliasIdx: uniqueIndex('idx_aliases_alias').on(table.alias),
}));

// ── Phone Numbers ──────────────────────────────────────────
export const phoneNumbers = pgTable('phone_numbers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
  twilioSid: varchar('twilio_sid', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  releasedAt: timestamp('released_at', { withTimezone: true }),
}, (table) => ({
  userIdIdx: index('idx_numbers_user_id').on(table.userId),
}));

// ── Virtual Cards ──────────────────────────────────────────
export const virtualCards = pgTable('virtual_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  stripeCardId: varchar('stripe_card_id', { length: 255 }).notNull().unique(),
  lastFour: varchar('last_four', { length: 4 }).notNull(),
  brand: varchar('brand', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  spendingLimitAmount: integer('spending_limit_amount'),
  spendingLimitInterval: varchar('spending_limit_interval', { length: 10 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  userIdIdx: index('idx_cards_user_id').on(table.userId),
}));

// ── Usage Records ──────────────────────────────────────────
export const usageRecords = pgTable('usage_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  billingPeriodStart: timestamp('billing_period_start', { withTimezone: true }).notNull(),
  billingPeriodEnd: timestamp('billing_period_end', { withTimezone: true }).notNull(),
  aliasesCreated: integer('aliases_created').notNull().default(0),
  phoneNumbersRented: integer('phone_numbers_rented').notNull().default(0),
  cardsCreated: integer('cards_created').notNull().default(0),
  smsReceived: integer('sms_received').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userPeriodIdx: index('idx_usage_user_period').on(table.userId, table.billingPeriodStart),
  userPeriodUnique: uniqueIndex('uq_usage_user_period').on(table.userId, table.billingPeriodStart),
}));

// ── Message Logs ───────────────────────────────────────────
export const messageLogs = pgTable('message_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  phoneNumberId: uuid('phone_number_id').notNull().references(() => phoneNumbers.id),
  fromNumber: varchar('from_number', { length: 20 }).notNull(),
  toNumber: varchar('to_number', { length: 20 }).notNull(),
  body: text('body'),
  direction: varchar('direction', { length: 10 }).notNull(),
  twilioSid: varchar('twilio_sid', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  phoneNumberIdx: index('idx_messages_phone_number').on(table.phoneNumberId),
  createdIdx: index('idx_messages_created').on(table.createdAt),
}));

// ── Email Forwarding Logs ──────────────────────────────────
export const emailForwardingLogs = pgTable('email_forwarding_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  aliasId: uuid('alias_id').notNull().references(() => emailAliases.id),
  fromAddress: varchar('from_address', { length: 255 }),
  toAddress: varchar('to_address', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  aliasIdx: index('idx_forwarding_alias').on(table.aliasId),
  createdIdx: index('idx_forwarding_created').on(table.createdAt),
}));