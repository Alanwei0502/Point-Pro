import { rateLimit } from 'express-rate-limit';

export const rateLimiterMiddleware = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: true,
});
