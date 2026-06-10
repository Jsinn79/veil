import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfile } from '../services/auth.service.js';
import { updateProfileSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

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

export default router;