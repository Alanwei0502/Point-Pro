import { z } from 'zod';
import { prismaClient } from '../helpers';
import { createStaffSchema } from '../validators';
import { LogType, User } from '@prisma/client';

export class UserModel {
  static findUser = async (params: { username?: User['username']; phone?: User['phone'] }) => {
    const user = await prismaClient.user.findUnique({
      where: {
        username: params.username,
        phone: params.phone,
      },
    });

    return user;
  };

  static createUser = async (params: z.infer<typeof createStaffSchema>) => {
    const user = await prismaClient.user.create({
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

  static createLoginLog = async (params: { userId: User['id'] }) => {
    const loginLog = await prismaClient.loginLog.create({
      data: {
        userId: params.userId,
        logType: LogType.LOGIN,
      },
    });
    return loginLog;
  };
}
