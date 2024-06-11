import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createStaffSchema = z.object({
  username: z.string(),
  gender: z.nativeEnum(Gender),
  phone: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  passwordHash: z.string(),
});
