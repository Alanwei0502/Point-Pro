import { Prisma } from '@prisma/client';
import SingletonRedis from '../helpers/SingletonRedis';
import { DatePeriodInfo, PeriodInfo } from '../types/shared';
import { appDayjs, prismaClient } from '../helpers';

export class PeriodService {
  // static getPeriods = async (isOnlineBooking: boolean, dateFrom: Date, dateTo: Date, excludeTime: boolean) => {
  //   const dateFromString = appDayjs(dateFrom).format('YYYY/MM/DD');
  //   const dateToString = appDayjs(dateTo).format('YYYY/MM/DD');

  //   const dateTimeFromString = appDayjs(dateFrom).format('YYYY/MM/DD:HH');
  //   const dateTimeToString = appDayjs(dateTo).format('YYYY/MM/DD:HH');

  //   const cacheKey = excludeTime
  //     ? `periods:${dateFromString}:${dateToString}:${isOnlineBooking ? 'online' : 'phone'}`
  //     : `periods:${dateTimeFromString}:${dateTimeToString}:${isOnlineBooking ? 'online' : 'phone'}`;

  //   const periods = await SingletonRedis.getInstance().getClient().get(cacheKey);

  //   if (!periods) {
  //     const isOnlineFilter: Prisma.PeriodSeatWhereInput = isOnlineBooking
  //       ? { canOnlineBooked: true }
  //       : { canOnlineBooked: { not: true } };
  //     const periods = await prismaClient.period.findMany({
  //       where: {
  //         startTime: {
  //           gte: dateFrom,
  //           lte: dateTo,
  //         },
  //         periodSeats: {
  //           some: isOnlineFilter,
  //         },
  //       },
  //       include: {
  //         periodSeats: {
  //           where: isOnlineFilter,
  //           include: {
  //             seats: {
  //               select: {
  //                 seatNo: true,
  //                 capacity: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     const periodsWithAmount: PeriodInfo[] = periods.map((period) => {
  //       let total = 0;
  //       let available = 0;

  //       period.periodSeats.forEach((periodSeats) => {
  //         if (periodSeats.canBooked) {
  //           available += periodSeats.seat.amount;
  //         }
  //         total += periodSeats.seat.amount;
  //       });
  //       return {
  //         id: period.id,
  //         periodStartedAt: period.startedAt,
  //         periodEndedAt: period.endedAt,
  //         amount: total,
  //         available,
  //       };
  //     });

  //     const datePeriodsWithAmount = periodsWithAmount
  //       .sort((a, b) => a.periodStartedAt.valueOf() - b.periodEndedAt.valueOf())
  //       .reduce<DatePeriodInfo[]>((prev, curr) => {
  //         const targets = prev.filter(
  //           (d) => d.date.toLocaleDateString('zh-tw') === curr.periodStartedAt.toLocaleDateString('zh-tw'),
  //         );

  //         if (targets.length === 0) {
  //           const newDatePeriod: DatePeriodInfo = {
  //             date: curr.periodStartedAt,
  //             periods: [curr],
  //             totalAmount: curr.amount,
  //             totalAvailable: curr.available,
  //           };

  //           return [...prev, newDatePeriod];
  //         }
  //         const target = targets[0];

  //         const newTarget = {
  //           ...target,
  //           periods: [...target.periods, curr],
  //           totalAmount: target.totalAmount + curr.amount,
  //           totalAvailable: target.totalAvailable + curr.available,
  //         };

  //         return [
  //           ...prev.filter(
  //             (d) => d.date.toLocaleDateString('zh-tw') !== curr.periodStartedAt.toLocaleDateString('zh-tw'),
  //           ),
  //           newTarget,
  //         ];
  //       }, []);

  //     const data = datePeriodsWithAmount.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  //     await SingletonRedis.getInstance()
  //       .getClient()
  //       .set(cacheKey, JSON.stringify(data), 'EX', excludeTime ? 60 * 60 * 12 : 60 * 9);

  //     return data;
  //   } else {
  //     console.log('get');
  //     return JSON.parse(periods);
  //   }
  // };
  static delPeriods = async () => {
    const keys = await SingletonRedis.getInstance().getClient().keys(`periods:*:online`);
    console.log(keys);
    if (keys.length > 0) {
      await SingletonRedis.getInstance().getClient().del(keys);
    }
  };
}
