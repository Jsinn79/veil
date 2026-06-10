import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { checkPlanLimit } from '../middleware/subscription.middleware.js';
import { createAlias, listAliases, getAlias, updateAlias, deleteAlias } from '../services/alias.service.js';
import { incrementUsage } from '../services/usage.service.js';
import { createAliasSchema, updateAliasSchema } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const aliases = await listAliases(req.user!.sub);
    res.json({ data: aliases });
  } catch (err) {
    next(err);
  }
});

router.post('/', checkPlanLimit('aliases_created'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createAliasSchema.parse(req.body);
    const alias = await createAlias(req.user!.sub, data.forwarding_address, data.display_name);
    await incrementUsage(req.user!.sub, 'aliases_created');
    res.status(201).json({ data: alias });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alias = await getAlias(req.user!.sub, req.params.id);
    res.json({ data: alias });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateAliasSchema.parse(req.body);
    const alias = await updateAlias(req.user!.sub, req.params.id, data);
    res.json({ data: alias });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return next(new ValidationError('Invalid input', err.errors));
    }
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteAlias(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;