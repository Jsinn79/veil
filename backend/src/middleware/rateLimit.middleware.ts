import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/errors.js';

// Simple in-memory rate limiter (use Redis/DB in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(options: RateLimitOptions) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || req.user?.sub || 'unknown';
    const now = Date.now();

    const record = requestCounts.get(key);
    if (record && now < record.resetAt) {
      if (record.count >= options.maxRequests) {
        return next(new RateLimitError());
      }
      record.count++;
    } else {
      requestCounts.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
    }

    next();
  };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now >= record.resetAt) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);