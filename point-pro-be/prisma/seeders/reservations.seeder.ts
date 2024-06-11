import prisma from '../client';

export function insertReservations() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM reservations;
    `,
    prisma.$executeRaw`
      DO $$
      DECLARE
          period_record RECORD;
          random_is_cancelled BOOLEAN;
          random_people SMALLINT;
          random_remark VARCHAR(255);
      BEGIN
          FOR i IN 1..80 LOOP  
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

              -- random remark
              random_remark := 'Remark ' || trunc(random() * 1000)::TEXT;
  
              -- insert records
              INSERT INTO reservations (
                  type, 
                  username,
                  phone,
                  email,
                  gender,
                  people, 
                  remark,
                  is_cancelled, 
                  period_id
              ) VALUES (
                  CASE 
                      WHEN i % 2 = 0 IS NULL THEN 'PHONE'::reservation_type
                      ELSE 'ONLINE'::reservation_type
                  END,
                  '顧客' || i::TEXT,
                  '098' || LPAD(TRUNC(RANDOM() * 10000000)::VARCHAR, 7, '0'),
                  CASE 
                    WHEN i % 2 = 0 THEN NULL 
                    ELSE 'customer_email_' || i::TEXT || '@example.com' 
                  END,
                  CASE 
                    WHEN i % 2 = 0 THEN 'MALE'::gender
                    ELSE 'FEMALE'::gender
                  END,
                  random_people,
                  random_remark,
                  random_is_cancelled,
                  period_record.id
              );
          END LOOP;
      END $$;
    `,
  ]);
}
