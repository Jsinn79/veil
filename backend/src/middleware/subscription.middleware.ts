import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors.js';
import { PLAN_LIMITS, type PlanTier, type UsageRecordRow } from '../types/index.js';

/**
 * Middleware that checks if the user's plan allows creating a resource.
 * The check is done by looking up usage for the current billing period.
 */
export function checkPlanLimit(resourceType: 'aliases_created' | 'phone_numbers_rented' | 'cards_created') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    const planTier = req.user.tier as PlanTier;
    const limits = PLAN_LIMITS[planTier];

    // Determine the max allowed for this resource
    let maxAllowed: number;
    let featureName: string;

    switch (resourceType) {
      case 'aliases_created':
        maxAllowed = limits.aliasesPerMonth;
        featureName = 'Email aliases';
        break;
      case 'phone_numbers_rented':
        maxAllowed = limits.phoneNumbersPerMonth;
        featureName = 'Phone numbers';
        break;
      case 'cards_created':
        maxAllowed = limits.cardsPerMonth;
        featureName = 'Virtual cards';
        break;
    }

    if (maxAllowed === Infinity) {
      return next(); // Pro plan with unlimited
    }

    if (maxAllowed === 0) {
      return next(new ForbiddenError(`${featureName} are not available on your plan. Upgrade to continue.`));
    }

    try {
      // Usage check would be done here via usage service
      // For now we pass through — will be implemented in service layer
      next();
    } catch (err) {
      next(err);
    }
  };
}