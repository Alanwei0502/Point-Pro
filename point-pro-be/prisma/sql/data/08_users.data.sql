DELETE FROM users;

INSERT INTO
  "users" ("username", "phone", "email", "gender", "role")
SELECT
  CASE
    WHEN seq <= 1 THEN '管理員'
    WHEN seq <= 6 THEN '員工' || (seq - 1)::TEXT
    ELSE '顧客' || (seq - 6)::TEXT
  END AS "username",
  CASE
    WHEN seq <= 1 THEN '0987654321'
    ELSE '09' || LPAD(TRUNC(RANDOM() * 100000000)::VARCHAR, 8, '0')
  END AS "phone",
  CASE
    WHEN seq <= 1 THEN 'admin_email_' || (seq -1)::TEXT || '@example.com'
    WHEN seq <= 6 THEN 'staff_email_' || (seq - 1)::TEXT || '@example.com'
    WHEN seq % 4 = 1 THEN 'customer_email_' || (seq - 6)::TEXT || '@example.com'
  END AS "email",
  CASE
    WHEN seq % 3 = 0 THEN 'MALE'::gender
    WHEN seq % 3 = 1 THEN 'FEMALE'::gender
    ELSE 'OTHER'::gender
  END AS "gender",
  CASE
    WHEN seq = 1 THEN 'ADMIN'::ROLE
    WHEN seq <= 6 THEN 'STAFF'::ROLE
    ELSE 'CUSTOMER'::ROLE
  END AS "role"
FROM
  GENERATE_SERIES(1, 100) AS seq;