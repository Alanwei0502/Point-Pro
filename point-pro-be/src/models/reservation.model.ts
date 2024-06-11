import { z } from 'zod';
import { appDayjs, prismaClient } from '../helpers';
import { createReservationRequestSchema, getReservationsRequestSchema } from '../validators';
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
      },
      include: {
        periods: true,
      },
    });

    return reservations;
  };

  static createReservation = async (params: z.infer<typeof createReservationRequestSchema>) => {
    const reservation = await prismaClient.reservation.create({
      data: params,
      include: {
        periods: true,
      },
    });
    return reservation;
  };

  static updateReservation = async (id: Reservation['id'], params: z.infer<typeof createReservationRequestSchema>) => {
    const reservation = await prismaClient.reservation.update({
      where: {
        id,
      },
      data: params,
      include: {
        periods: true,
      },
    });

    return reservation;
  };

  static deleteReservation = async (id: Reservation['id']) => {
    const reservation = await prismaClient.reservation.delete({
      where: {
        id,
      },
    });

    return reservation;
  };
}
