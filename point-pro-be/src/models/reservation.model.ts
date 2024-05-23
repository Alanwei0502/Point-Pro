import { z } from 'zod';
import { prisma } from '../helpers';
import { createReservationSchema } from '../validators';

const getReservationByUserPhone = async (phone: string) => {
  const reservations = await prisma.user.findMany({
    where: {
      phone,
    },
    include: {
      reservations: {
        include: {
          periods: true,
        },
      },
    },
  });

  return reservations;
};

const createReservation = async (params: z.infer<typeof createReservationSchema>) => {
  const reservation = await prisma.reservation.create({
    data: {
      type: params.type,
      people: params.people,
      remark: params.remark,
      userId: params.userId,
      periodId: params.periodId,
    },
  });

  return reservation;
};

export const reservationModel = {
  getReservationByUserPhone,
  createReservation,
};
