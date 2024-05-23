import { z } from 'zod';
import { prisma } from '../helpers';
import { createUserSchema } from '../validators';

const createUser = async (params: z.infer<typeof createUserSchema>) => {
  const user = await prisma.user.create({
    data: {
      username: params.username,
      gender: params.gender,
      phone: params.phone,
      email: params?.email ?? null,
      role: params.role,
    },
  });

  return user;
};

export const userModel = {
  createUser,
};
