import prisma from '../client';

export function insertPeriodSeats() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM period_seats;
    `,
    prisma.$executeRaw`
      INSERT INTO
        period_seats (period_id, seat_id)
      SELECT
        p.id AS period_id,
        s.id AS seat_id
      FROM
        seats AS s
        CROSS JOIN periods AS p
      ORDER BY
        start_time,
        seat_no ASC;
    `,
  ]);
}
