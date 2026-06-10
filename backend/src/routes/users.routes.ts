import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { query } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await query(
      `SELECT u.id, u.email, u.display_name, u.email_verified_at, u.created_at,
              s.plan_tier, s.status as subscription_status
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       WHERE u.id = $1`,
      [req.user!.sub],
    );
    const user = (results as any[])[0];
    if (!user) throw new NotFoundError('User');
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { display_name, email } = req.body;
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (display_name !== undefined) {
      fields.push(`display_name = $${idx++}`);
      values.push(display_name);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email.toLowerCase());
    }

    if (fields.length === 0) {
      return res.json({ message: 'No changes' });
    }

    fields.push('updated_at = NOW()');
    values.push(req.user!.sub);

    const results = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, display_name`,
      values,
    );
    res.json({ user: (results as any[])[0] });
  } catch (err) {
    next(err);
  }
});

export default router;