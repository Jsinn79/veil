import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { checkPlanLimit } from '../middleware/subscription.middleware.js';
import { createCard, listCards, updateCard, deleteCard } from '../services/card.service.js';
import { incrementUsage } from '../services/usage.service.js';
import { createCardSchema, updateCardSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await listCards(req.user!.sub);
    res.json({ data: cards });
  } catch (err) {
    next(err);
  }
});

router.post('/', checkPlanLimit('cards_created'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCardSchema.parse(req.body);
    const card = await createCard(
      req.user!.sub,
      data.spending_limit_amount,
      data.spending_limit_interval,
    );
    await incrementUsage(req.user!.sub, 'cards_created');
    res.status(201).json({ data: card });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await listCards(req.user!.sub);
    const card = cards.find(c => c.id === req.params.id);
    if (!card) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Card not found' } });
    }
    res.json({ data: card });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateCardSchema.parse(req.body);
    const card = await updateCard(req.user!.sub, req.params.id, data);
    res.json({ data: card });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteCard(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;