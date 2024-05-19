SELECT
  u.username,
  r.people,
  p.start_time,
  s.seat_no,
  s.capacity,
  u.id,
  s.id,
  p.id,
  r.id
FROM
  reservation_period_seats AS rps
  JOIN periods AS p ON p.id = rps.period_id
  JOIN seats AS s ON s.id = rps.seat_id
  JOIN reservations AS r ON r.id = rps.reservation_id
  JOIN users AS u ON u.id = r.user_id
ORDER BY
  start_time,
  seat_no;