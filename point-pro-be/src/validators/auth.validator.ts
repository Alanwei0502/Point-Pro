import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const verifyAdminAndStaffSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.nativeEnum(Role),
  phone: z.string(),
  email: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
});

export const verifyCustomerSchema = z.object({
  id: z.string(),
  username: z.string(),
  people: z.number(),
  startAt: z.string().date(),
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
