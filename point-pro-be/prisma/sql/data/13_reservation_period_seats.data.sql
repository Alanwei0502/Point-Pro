DELETE FROM reservation_period_seats;

DO $$
DECLARE
  r_record RECORD;
  p_s_record RECORD;
BEGIN
  FOR r_record IN (SELECT * FROM reservations) LOOP
    FOR p_s_record IN (SELECT period_id, seat_id, capacity FROM period_seats JOIN seats ON period_seats.seat_id = seats.id) LOOP
      IF r_record.period_id = p_s_record.period_id THEN
        WHILE r_record.people > 0 LOOP
          IF (r_record.people >= 8 AND p_s_record.capacity = 10) OR (r_record.people < 8 AND p_s_record.capacity = 2) THEN
            IF NOT EXISTS (SELECT 1 FROM reservation_period_seats AS rps WHERE rps.period_id = p_s_record.period_id AND rps.seat_id = p_s_record.seat_id) THEN
            INSERT INTO reservation_period_seats (reservation_id, period_id, seat_id) VALUES (r_record.id, p_s_record.period_id, p_s_record.seat_id);
            r_record.people := r_record.people - p_s_record.capacity;
            ELSE 
              EXIT;
            END IF;
          ELSE
            EXIT;
          END IF;
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;
END $$;