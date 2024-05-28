import { Gender, Role } from '@prisma/client';
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

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const registerSchema = z.object({
  username: z.string(),
  gender: z.nativeEnum(Gender),
  phone: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
});
