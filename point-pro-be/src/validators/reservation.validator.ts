import { date, object, string } from 'yup';
import { z } from 'zod';
import { ReservationType } from '@prisma/client';
import { createUserSchema } from './user.validator';

export const verifyReservationSchema = object({
  reservationId: string().required(),
  reservationType: string().optional(),
  startTime: date().required(),
  seatNo: string().required(),
  periodStartTime: date().optional(),
  periodEndTime: date().optional(),
});

export const createReservationSchema = z.object({
  type: z.nativeEnum(ReservationType),
  people: z.number().max(10),
  remark: z.string().optional(),
  userId: z.string(),
  periodId: z.string(),
});

export const createReservationRequestBodySchema = z
  .intersection(
    createUserSchema,
    z.object({
      periodId: z.string(),
      remark: z.string().optional(),
      people: z.number().max(10),
      type: z.nativeEnum(ReservationType),
    }),
  )
  .refine((data) => !data.email || data.type === ReservationType.ONLINE, {
    message: 'email is required for online reservation',
  });

export const findReservationByPhoneSchema = z.object({
  phone: z.string(),
});
