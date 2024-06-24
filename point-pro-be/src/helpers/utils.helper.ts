import { Gender, OrderStatus, Payment } from '@prisma/client';
import { z } from 'zod';
import { ApiResponse, AuthRequest } from '../types';
import { verifyAdminAndStaffSchema, verifyCustomerSchema } from '../validators';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const genderTranslate = {
  [Gender.MALE]: '先生',
  [Gender.FEMALE]: '小姐',
  [Gender.OTHER]: '先生/小姐',
};

export const getRoleAndAuth = (req: AuthRequest) => {
  switch (req.role) {
    case 'admin': {
      const adminAuth = req.auth as z.infer<typeof verifyAdminAndStaffSchema>;
      return { role: req.role, auth: adminAuth };
    }
    case 'customer': {
      const customerAuth = req.auth as z.infer<typeof verifyCustomerSchema>;
      return { role: req.role, auth: customerAuth };
    }
    default: {
      throw new Error('Invalid token');
    }
  }
};

export const checkOrderStatusValidator = <K extends { status: OrderStatus; paymentId: Payment['id'] }, D extends K | K[]>(
  data: D,
  res: ApiResponse,
) => {
  if (Array.isArray(data)) {
    // DINE_IN
    if (!data.length) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: ReasonPhrases.NOT_FOUND,
        result: '找不到訂單',
      });
    }

    if (data.every((o) => o.status === OrderStatus.CANCEL)) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '所有訂單已取消',
      });
    }

    if (data.some((o) => o.status === OrderStatus.WORKING)) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '尚有訂單未完成',
      });
    }

    if (data.every((o) => o.paymentId)) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '訂單已付款',
      });
    }
  } else {
    // TAKE_OUT
    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: ReasonPhrases.NOT_FOUND,
        result: '找不到訂單',
      });
    }

    if (data.status === OrderStatus.CANCEL) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '訂單已取消',
      });
    }

    if (data.status === OrderStatus.WORKING) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '訂單尚未完成',
      });
    }

    if (data.paymentId) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: ReasonPhrases.BAD_REQUEST,
        result: '訂單已付款',
      });
    }
  }
};
