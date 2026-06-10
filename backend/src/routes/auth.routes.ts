import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';
import {
  signup,
  login,
  refreshAccessToken,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../services/auth.service.js';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

// ─── Sign Up ──────────────────────────────────────────────
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

// ─── Login ───────────────────────────────────────────────
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

// ─── Logout ──────────────────────────────────────────────
router.post('/logout', authenticate, (_req: Request, res: Response) => {
  // In production, invalidate refresh token in DB or Redis
  res.json({ message: 'Logged out successfully' });
});

// ─── Refresh Token ───────────────────────────────────────
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

// ─── Get Current Profile ─────────────────────────────────
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getProfile(req.user!.sub);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// ─── Update Profile ─────────────────────────────────────
router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const result = await updateProfile(req.user!.sub, data);
    res.json(result);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

// ─── Send Email Verification ─────────────────────────────
router.post('/send-verification', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await sendVerificationEmail(req.user!.sub);
    // In production, don't return the token — email it
    res.json({ message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
});

// ─── Verify Email ────────────────────────────────────────
router.post('/verify-email', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ValidationError('Verification token is required');
    }
    await verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
});

// ─── Forgot Password ─────────────────────────────────────
router.post('/forgot-password', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    const result = await forgotPassword(data.email);
    res.json(result);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

// ─── Reset Password ──────────────────────────────────────
router.post('/reset-password', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = resetPasswordSchema.parse(req.body);
    await resetPassword(data.token, data.password);
    res.json({ message: 'Password reset successfully' });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

export default router;