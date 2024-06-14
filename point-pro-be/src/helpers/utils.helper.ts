import { Gender, Prisma } from '@prisma/client';
import { date as dateSchema, object } from 'yup';

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
