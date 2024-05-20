import prisma from '../client';

export function insertReservations() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM reservations;
    `,
    prisma.$executeRaw`
      DO $$
      DECLARE
          user_record RECORD;
          period_record RECORD;
          random_is_cancelled BOOLEAN;
          random_people SMALLINT;
      BEGIN
          FOR i IN 1..80 LOOP
              -- random user
              SELECT * 
              INTO user_record
              FROM users
              WHERE role != 'ADMIN' AND role != 'STAFF' AND users.phone IS NOT NULL
              LIMIT 1 OFFSET i;
  
              -- random period
              SELECT * 
              INTO period_record
              FROM periods
              WHERE periods.start_time > NOW() + '1 day'
              LIMIT 1 OFFSET i % 20;
  
              -- random cancellation
              random_is_cancelled := (random() < 0.1);
  
              -- random people
              random_people := trunc(random() * 10 + 1)::SMALLINT;
  
              -- insert records
              INSERT INTO reservations (
                  type, 
                  is_cancelled, 
                  people, 
                  user_id, 
                  period_id
              ) VALUES (
                  CASE 
                      WHEN user_record.email IS NULL THEN 'PHONE'::reservation_type
                      WHEN user_record.email IS NOT NULL THEN 'ONLINE'::reservation_type
                  END,
                  random_is_cancelled,
                  random_people,
                  user_record.id,
                  period_record.id
              );
          END LOOP;
      END $$;
    `,
  ]);
}
