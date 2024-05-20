import prisma from '../client';

export function insertSeats() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM seats;
    `,
    prisma.$executeRaw`
      WITH
        seats_data AS (
          SELECT
            CHR(GENERATE_SERIES(65, 67)) || n AS seat_no,
            2 AS capacity
          FROM
            GENERATE_SERIES(1, 6) AS n
          UNION
          SELECT
            CHR(71) || n AS seat_no,
            10 AS capacity
          FROM
            GENERATE_SERIES(1, 3) AS n
          ORDER BY
            capacity,
            seat_no ASC
        )
      INSERT INTO
        seats (seat_no, capacity)
      SELECT
        *
      FROM
        seats_data;
    `,
  ]);
}
