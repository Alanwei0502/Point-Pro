import { z } from 'zod';

export const verifyAdminSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
  memberId: z.string(),
  account: z.string(),
  email: z.string().optional(),
  role: z.string(),
});
