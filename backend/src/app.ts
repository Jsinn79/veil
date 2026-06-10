import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import aliasesRoutes from './routes/aliases.routes.js';
import numbersRoutes from './routes/numbers.routes.js';
import cardsRoutes from './routes/cards.routes.js';
import webhooksRoutes from './routes/webhooks.routes.js';

export function createApp() {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
  }));
  app.use(morgan('dev'));
  app.use(cookieParser());

  // ⚠️ Stripe webhook needs raw body — apply BEFORE the JSON body parser
  // The raw body is only needed for signature verification on /api/webhooks/stripe
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  // Standard JSON parsing for all other routes
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'veil-api', timestamp: new Date().toISOString() });
  });

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/subscriptions', subscriptionsRoutes);
  app.use('/api/aliases', aliasesRoutes);
  app.use('/api/numbers', numbersRoutes);
  app.use('/api/cards', cardsRoutes);
  app.use('/api/webhooks', webhooksRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}