import { Gender, ReservationType } from '@prisma/client';
import { z } from 'zod';

export const getReservationsRequestSchema = z.object({
  date: z.string(),
});

export const createReservationRequestSchema = z.object({
  type: z.nativeEnum(ReservationType),
  username: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  gender: z.nativeEnum(Gender),
  people: z.number().max(10),
  remark: z.string().nullable(),
  periodId: z.string(),
});

export const updateReservationRequestSchema = z.object({
  reservationId: z.string(),
});

export const deleteReservationRequestSchema = z.object({
  reservationId: z.string(),
});

// TODO: refactor
export const verifyReservationSchema = z.object({
  reservationId: z.string(),
  reservationType: z.string().optional(),
  startTime: z.date(),
  seatNo: z.string(),
  periodStartTime: z.date().optional(),
  periodEndTime: z.date().optional(),
});
