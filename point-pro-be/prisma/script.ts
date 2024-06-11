import prisma from './client';

async function main() {
  const p1 = performance.now();
  const startTime = new Date('2024-06-20');

  const result = await prisma.$queryRaw`
    SELECT  p.id, p.start_time, CAST(SUM(s.capacity) AS int) AS remain_capacity
    FROM period_seats AS ps
    JOIN periods AS p ON ps.period_id = p.id
    JOIN seats AS s ON ps.seat_id = s.id
    WHERE NOT EXISTS (
        SELECT 1
        FROM reservation_period_seats rps
        WHERE rps.period_id = ps.period_id
        AND rps.seat_id = ps.seat_id
    )
    AND p.start_time > ${startTime}
    GROUP BY p.id
    ORDER BY p.start_time;
  `;

  const p2 = performance.now();

  console.log(p2 - p1, result);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
