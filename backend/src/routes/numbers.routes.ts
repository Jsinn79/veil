import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { checkPlanLimit } from '../middleware/subscription.middleware.js';
import { rentNumber, listNumbers, releaseNumber, getMessageLogs } from '../services/number.service.js';
import { incrementUsage } from '../services/usage.service.js';
import { createPhoneNumberSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numbers = await listNumbers(req.user!.sub);
    res.json({ data: numbers });
  } catch (err) {
    next(err);
  }
});

router.post('/', checkPlanLimit('phone_numbers_rented'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createPhoneNumberSchema.parse(req.body);
    const number = await rentNumber(req.user!.sub, data.area_code);
    await incrementUsage(req.user!.sub, 'phone_numbers_rented');
    res.status(201).json({ data: number });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numbers = await listNumbers(req.user!.sub);
    const number = numbers.find(n => n.id === req.params.id);
    if (!number) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Phone number not found' } });
    }
    res.json({ data: number });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await releaseNumber(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/:id/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await getMessageLogs(req.user!.sub, req.params.id);
    res.json({ data: messages });
  } catch (err) {
    next(err);
  }
});

export default router;