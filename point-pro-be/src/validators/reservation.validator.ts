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
  type: z.nativeEnum(ReservationType).optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().nullable().optional(),
  gender: z.nativeEnum(Gender).optional(),
  people: z.number().max(10).optional(),
  remark: z.string().nullable().optional(),
  periodId: z.string().optional(),
  startAt: z.string().nullable().optional(),
  endAt: z.string().nullable().optional(),
  isCancelled: z.boolean().optional(),
});

export const deleteReservationRequestSchema = z.object({
  reservationId: z.string(),
});
