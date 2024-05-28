import { z } from 'zod';
import { prisma } from '../helpers';
import { createCustomerSchema, createStaffSchema, registerSchema } from '../validators';
import { LogType } from '@prisma/client';

const createCustomerUser = async (params: z.infer<typeof createCustomerSchema>) => {
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

const createStaffUser = async (params: z.infer<typeof createStaffSchema>) => {
  const user = await prisma.user.create({
    data: {
      username: params.username,
      gender: params.gender,
      phone: params.phone,
      email: params.email,
      role: params.role,
      passwordHash: params.passwordHash,
    },
  });

  return user;
};

const findUserByUsername = async (params: { username: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  return user;
};

const createLoginLog = async (params: { userId: string }) => {
  const loginLog = await prisma.loginLog.create({
    data: {
      userId: params.userId,
      logType: LogType.LOGIN,
    },
  });
  return loginLog;
};

export const userModel = {
  createCustomerUser,
  createStaffUser,
  findUserByUsername,
  createLoginLog,
};
