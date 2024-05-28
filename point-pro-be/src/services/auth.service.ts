import jwt from 'jsonwebtoken';
import { prisma, throwError } from '../helpers';

export class AuthService {
  static signJWT = async (
    payload:
      | {
          sub: string;
          memberId?: string;
          name?: string;
          phone?: string;
          email?: string;
          role: string;
        }
      | {
          reservationId: string;
          reservationType?: string;
          startTime: Date;
          seatNo: string;
          periodStartTime?: Date;
          periodEndTime?: Date;
        },
    expiresIn = '1 day',
  ) => {
    if (!process.env.POINT_PRO_SECRET) {
      throw new Error('no jwt secret');
    }
    return jwt.sign(payload, process.env.POINT_PRO_SECRET, { expiresIn });
  };

  static generateReservationToken = async (reservationId: string) => {
    try {
      const reservation = await prisma.reservationPeriodSeat.findFirst({
        where: {
          reservationId: reservationId,
        },
        include: {
          reservations: true,
          periodSeats: {
            include: {
              periods: true,
              seats: true,
            },
          },
        },
      });

      if (reservation) {
        const { reservations, periodSeats, periodId } = reservation;

        const reservationType = reservations?.type;

        const seatAndPeriod = await prisma.periodSeat.findFirst({
          where: {
            periodId,
            seatId: periodSeats.seatId,
          },
        });

        if (seatAndPeriod) {
          return throwError({
            code: 400,
            message: `reservation ${reservation.reservationId} not created successfully, please contact administrator.`,
            sendError: false,
          });
        }
        const seatNo = reservation.periodSeats.seats.seatNo;
        const startTime = new Date();
        const periodStartTime = reservation.periodSeats.periods.startTime;
        const periodEndTime = reservation.periodSeats.periods.endTime;

        const token = await this.signJWT({
          seatNo,
          reservationType,
          startTime,
          reservationId,
          periodStartTime,
          periodEndTime,
        });
        return token;
      }

      return throwError({
        code: 400,
        message: `reservation ${reservationId} not existed`,
      });
    } catch (error) {
      return throwError({
        code: 500,
        message: (error as Error).message,
      });
    }
  };
}
