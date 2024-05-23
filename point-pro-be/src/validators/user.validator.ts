import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string(),
  gender: z.nativeEnum(Gender),
  phone: z.string(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role),
});
