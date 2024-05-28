import { Period, Prisma, ReservationType, Seat, PeriodSeat } from '@prisma/client';
import { appDayjs, prisma } from '../helpers';
import { CreateRecord } from '../types/reservation';

export class ReservationService {
  // static createAutoReservedSeatsRecord = async (
  //   type: ReservationType,
  //   logId: string,
  //   periodStartedAt: Date,
  //   amount: number,
  //   options: { [key: string]: any },
  // ): Promise<CreateRecord> => {
  //   if (amount === 5 || amount === 6 || amount > 10) {
  //     return {
  //       status: 400,
  //       details: 'people amount not supported',
  //       reservationId: '',
  //     };
  //   }
  //   const period = await prisma.period.findFirst({
  //     where: {
  //       startTime: appDayjs(periodStartedAt).toISOString(),
  //     },
  //   });
  //   if (!period) {
  //     return {
  //       status: 400,
  //       details: `Can not found period started at ${periodStartedAt}`,
  //       reservationId: '',
  //     };
  //   }
  //   const seatPeriods = await prisma.periodSeat.findMany({
  //     where: {
  //       periodId: period?.id,
  //       canOnlineBooked: type === 'OnlineBooking',
  //       canBooked: true,
  //     },
  //     include: {
  //       seat: { include: { siblings: { include: { nextSeat: true } } } },
  //       period: true,
  //     },
  //   });
  //   let targetSeatPeriod:
  //     | (PeriodSeat & {
  //         period: Period;
  //         seat: Seat & {
  //           siblings: (SeatSibling & {
  //             nextSeat: Seat;
  //           })[];
  //         };
  //       })
  //     | undefined;
  //   if (amount < 3) {
  //     const twoSeats = seatPeriods.filter((periodSeat) => {
  //       return periodSeat.seat.amount === 2;
  //     });
  //     if (twoSeats.length < 1) {
  //       return {
  //         status: 404,
  //         details: 'There is no suitable seat, please try other period',
  //         reservationId: '',
  //       };
  //     }
  //     targetSeatPeriod = twoSeats[0];
  //     const createReservationLog: Prisma.ReservationLogCreateInput = {
  //       id: logId,
  //       reservedAt: new Date(),
  //       type,
  //       options,
  //       startOfMeal: null,
  //       bookedSeats: {
  //         create: [
  //           {
  //             seatId: targetSeatPeriod.seatId,
  //             periodId: targetSeatPeriod.periodId,
  //           },
  //         ],
  //       },
  //     };
  //     const updateSeatPeriod: Prisma.SeatPeriodUpdateInput = {
  //       canBooked: { set: false },
  //     };
  //     await prisma.$transaction([
  //       prisma.reservationLog.create({ data: createReservationLog }),
  //       prisma.periodSeat.update({ data: updateSeatPeriod, where: { id: targetSeatPeriod.id } }),
  //     ]);
  //   } else if (amount === 3 || amount === 4) {
  //     const twoSeatPeriods = seatPeriods.filter((periodSeat) => {
  //       const nextSeats = periodSeat.seat.siblings;
  //       return nextSeats.length > 0
  //         ? seatPeriods.filter((periodSeat) => nextSeats.length > 0 && periodSeat.seatId === nextSeats[0].nextSeatId)
  //         : false;
  //     });
  //     if (twoSeatPeriods.length < 1) {
  //       return {
  //         status: 404,
  //         details: 'There is no suitable seat, please try other period',
  //         reservationId: '',
  //       };
  //     }
  //     targetSeatPeriod = twoSeatPeriods[0];
  //     const createReservationLog: Prisma.ReservationLogCreateInput = {
  //       id: logId,
  //       reservedAt: new Date(),
  //       type,
  //       options,
  //       startOfMeal: null,
  //       endOfMeal: null,
  //     };
  //     const createReservationSeats: Prisma.ReservationSeatCreateInput[] = [
  //       {
  //         seat: {
  //           connect: { id: targetSeatPeriod.seatId },
  //         },
  //         period: {
  //           connect: { id: targetSeatPeriod.periodId },
  //         },
  //         reservationLog: {
  //           connect: { id: logId },
  //         },
  //       },
  //       {
  //         seat: {
  //           connect: { id: targetSeatPeriod.seat.siblings[0].nextSeatId },
  //         },
  //         period: {
  //           connect: { id: targetSeatPeriod.periodId },
  //         },
  //         reservationLog: {
  //           connect: { id: logId },
  //         },
  //       },
  //     ];
  //     const nextSeatPeriod = await prisma.periodSeat.findFirst({
  //       where: {
  //         seatId: targetSeatPeriod.seat.siblings[0].nextSeatId,
  //         periodId: targetSeatPeriod.periodId,
  //         canBooked: true,
  //       },
  //     });
  //     if (!nextSeatPeriod) {
  //       return {
  //         status: 404,
  //         details: 'Can not booked suitable seat',
  //         reservationId: '',
  //       };
  //     }
  //     const updateSeatPeriod: Prisma.SeatPeriodUpdateInput = {
  //       canBooked: { set: false },
  //     };
  //     await prisma.$transaction([
  //       prisma.reservationLog.create({ data: createReservationLog }),
  //       ...createReservationSeats.map((reservationSeat) => prisma.reservationSeat.create({ data: reservationSeat })),
  //       prisma.periodSeat.update({ data: updateSeatPeriod, where: { id: targetSeatPeriod.id } }),
  //       prisma.periodSeat.update({ data: updateSeatPeriod, where: { id: nextSeatPeriod.id } }),
  //     ]);
  //   } else if (amount < 11 && amount > 6) {
  //     const targetSeatPeriods = seatPeriods.filter((periodSeat) => {
  //       return periodSeat.seat.amount === 10;
  //     });
  //     if (targetSeatPeriods.length < 1) {
  //       return {
  //         status: 404,
  //         details: 'There is no suitable seat, please try other period',
  //         reservationId: '',
  //       };
  //     }
  //     targetSeatPeriod = targetSeatPeriods[0];
  //     const createReservationLog: Prisma.ReservationLogCreateInput = {
  //       id: logId,
  //       reservedAt: new Date(),
  //       type,
  //       startOfMeal: null,
  //       endOfMeal: null,
  //       options,
  //       bookedSeats: {
  //         create: [
  //           {
  //             seatId: targetSeatPeriod.seatId,
  //             periodId: targetSeatPeriod.periodId,
  //           },
  //         ],
  //       },
  //     };
  //     const updateSeatPeriod: Prisma.SeatPeriodUpdateInput = {
  //       canBooked: { set: false },
  //     };
  //     await prisma.$transaction([
  //       prisma.reservationLog.create({ data: createReservationLog }),
  //       prisma.periodSeat.update({ data: updateSeatPeriod, where: { id: targetSeatPeriod.id } }),
  //     ]);
  //   } else {
  //     return {
  //       status: 400,
  //       details: 'Invalid Input',
  //       reservationId: '',
  //     };
  //   }
  //   const reservation = await prisma.reservationSeat.findFirst({
  //     where: {
  //       seatId: targetSeatPeriod?.seatId,
  //       periodId: targetSeatPeriod?.periodId,
  //     },
  //     select: {
  //       reservationId: true,
  //     },
  //   });
  //   if (reservation && reservation.reservationId) {
  //     return {
  //       status: 201,
  //       details: '',
  //       reservationId: reservation.reservationId,
  //     };
  //   }
  //   return {
  //     status: 500,
  //     details: 'Create reservation failed',
  //     reservationId: '',
  //   };
  // };
}
