import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  display_name: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createAliasSchema = z.object({
  forwarding_address: z.string().email('Invalid forwarding email'),
  display_name: z.string().max(100).optional(),
});

export const updateAliasSchema = z.object({
  forwarding_address: z.string().email('Invalid forwarding email').optional(),
  display_name: z.string().max(100).optional(),
  is_active: z.boolean().optional(),
});

export const createPhoneNumberSchema = z.object({
  area_code: z.string().regex(/^\d{3}$/, 'Area code must be 3 digits').optional(),
  label: z.string().max(100).optional(),
});

export const createCardSchema = z.object({
  display_name: z.string().max(100).optional(),
  spending_limit_amount: z.number().int().positive().optional(),
  spending_limit_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

export const updateCardSchema = z.object({
  status: z.enum(['active', 'frozen']).optional(),
  spending_limit_amount: z.number().int().positive().optional(),
  spending_limit_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});