import { rateLimit } from 'express-rate-limit';

export const rateLimiterMiddleware = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: true,
});
