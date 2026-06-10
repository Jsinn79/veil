import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';
import { signup, login, refreshAccessToken } from '../services/auth.service.js';
import { signupSchema, loginSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

router.post('/signup', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = signupSchema.parse(req.body);
    const result = await signup(data.email, data.password, data.display_name);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 20 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await login(data.email, data.password);
    res.json(result);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.post('/logout', authenticate, (_req: Request, res: Response) => {
  // In production, invalidate refresh token in DB
  res.json({ message: 'Logged out successfully' });
});

router.post('/refresh', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw new ValidationError('Refresh token is required');
    }
    const accessToken = refreshAccessToken(refresh_token);
    res.json({ access_token: accessToken });
  } catch (err) {
    next(err);
  }
});

export default router;