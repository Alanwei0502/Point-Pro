import { z } from 'zod';
import { appDayjs, prismaClient } from '../helpers';
import { createReservationRequestSchema, getReservationsRequestSchema, updateReservationRequestSchema } from '../validators';
import { Reservation } from '@prisma/client';

export class ReservationModel {
  static getReservationById = async (id: Reservation['id']) => {
    const reservation = await prismaClient.reservation.findUnique({
      where: {
        id,
      },
      include: {
        periods: true,
      },
    });

    return reservation;
  };

  static getReservations = async (params: z.infer<typeof getReservationsRequestSchema>) => {
    const reservations = await prismaClient.reservation.findMany({
      where: {
        periods: {
          startTime: {
            gte: appDayjs(params.date).startOf('day').toDate(),
          },
          endTime: {
            lte: appDayjs(params.date).endOf('day').toDate(),
          },
        },
        isCancelled: false,
      },
      include: {
        periods: true,
        orders: {
          include: {
            payments: true,
          },
        },
      },
      orderBy: {
        username: 'asc',
      },
    });

    return reservations;
  };

  static createReservation = async (data: z.infer<typeof createReservationRequestSchema>) => {
    const reservation = await prismaClient.reservation.create({
      data,
      include: {
        periods: true,
      },
    });
    return reservation;
  };

  static updateReservation = async (id: Reservation['id'], data: z.infer<typeof updateReservationRequestSchema>) => {
    if (!data) return;

    const reservation = await prismaClient.reservation.update({
      where: {
        id,
      },
      data,
      include: {
        periods: true,
      },
    });

    return reservation;
  };

  static startDiningResevation = async (id: Reservation['id']) => {
    const reservation = await prismaClient.reservation.update({
      where: {
        id,
      },
      data: {
        startAt: new Date(),
      },
      include: {
        periods: true,
      },
    });

    return reservation;
  };

  static deleteReservation = async (id: Reservation['id']) => {
    const reservation = await prismaClient.reservation.update({
      where: {
        id,
      },
      data: {
        isCancelled: true,
      },
    });

    return reservation;
  };
}
