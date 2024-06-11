import { appDayjs, prismaClient } from '../helpers';
import { SeatModel } from './seat.model';

export class PeriodModel {
  static getAvailablePeriods = async () => {
    const today = appDayjs().startOf('day').toDate();

    const totalSeatsNumber = await SeatModel.getTotalSeatsNumber();

    const periods = (await prismaClient.$queryRaw`
      SELECT
        p.id,
        p.start_time,
        CAST(SUM(CASE WHEN r.people % 2 = 1 THEN r.people + 1 ELSE r.people END) AS int) AS occupy_seats
      FROM
        reservations AS r
        RIGHT JOIN periods AS p ON r.period_id = p.id
      WHERE p.start_time >= ${today}
      GROUP BY
        p.id
      ORDER BY
        p.start_time ASC;
  `) as { id: string; start_time: Date; occupy_seats: number }[];

    const results = periods.map((p) => ({
      id: p.id,
      startTime: p.start_time,
      capacity: totalSeatsNumber - p.occupy_seats,
    }));

    return results;
  };
}
