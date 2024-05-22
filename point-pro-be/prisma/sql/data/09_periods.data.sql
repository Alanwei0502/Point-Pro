DELETE FROM periods;

WITH
  date_series AS (
    SELECT
      GENERATE_SERIES(
        CURRENT_DATE - INTERVAL '7 days',
        CURRENT_DATE + INTERVAL '29 days',
        INTERVAL '1 day'
      )::date AS date
  ),
  time_series AS (
    SELECT
      (GENERATE_SERIES(35, 43) * INTERVAL '30 minutes')::TIME AS start_time
  ),
  periods_data AS (
    SELECT
      (ds.date + ts.start_time)::TIMESTAMPTZ AS start_time,
      (ds.date + (ts.start_time + INTERVAL '2 hours'))::TIMESTAMPTZ AS end_time
    FROM
      date_series ds
      CROSS JOIN time_series ts
  )
INSERT INTO
  periods (start_time, end_time)
SELECT
  *
FROM
  periods_data;