import { Gender, Prisma } from '@prisma/client';
import { date as dateSchema, object } from 'yup';
import { AuthRequest } from '../types';
import { verifyAdminAndStaffSchema, verifyCustomerSchema } from '../validators';
import { z } from 'zod';

export const genderTranslate = {
  [Gender.MALE]: '先生',
  [Gender.FEMALE]: '小姐',
  [Gender.OTHER]: '先生/小姐',
};

// below are all seatController utils
export const formatReservationOptions = (options: Prisma.JsonValue) => {
  return typeof options === 'object' && options ? options : undefined;
};

export const getDateOnly = (targetDate: Date) => {
  const dateInput = object({
    date: dateSchema()
      .optional()
      .default(() => new Date()),
  });
  const todayDateString = targetDate.toLocaleDateString('zh-tw');
  const { date } = dateInput.cast({ date: todayDateString });

  return date;
};

export const getDefaultDate = () => {
  const dateInput = object({
    date: dateSchema()
      .optional()
      .default(() => new Date()),
  });
  const todayDateString = new Date().toLocaleDateString('zh-tw');
  const { date } = dateInput.cast({ date: todayDateString });

  return date;
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
