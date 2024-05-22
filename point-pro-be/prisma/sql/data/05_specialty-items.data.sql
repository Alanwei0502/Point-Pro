DELETE FROM specialty_items;

INSERT INTO
  specialty_items (title, price)
VALUES
  ('不辣', 0),
  ('小辣', 0),
  ('中辣', 0),
  ('大辣', 0),
  ('少油', 0),
  ('少鹽', 0),
  ('無味素', 0),
  ('不加蔥', 0),
  ('不加洋蔥', 0),
  ('不加香菜', 0),
  ('不加薑', 0),
  ('不加胡椒', 0),
  ('吃素', 0),
  ('蛋奶素', 0),
  ('加10元', 10),
  ('加20元', 20);

UPDATE specialty_items
SET
  specialty_id = (
    SELECT
      id
    FROM
      specialties
    WHERE
      title = '辣度'
  )
WHERE
  title IN ('不辣', '小辣', '中辣', '大辣');

UPDATE specialty_items
SET
  specialty_id = (
    SELECT
      id
    FROM
      specialties
    WHERE
      title = '特別調整'
  )
WHERE
  title IN (
    '少油',
    '少鹽',
    '無味素',
    '不加蔥',
    '不加洋蔥',
    '不加香菜',
    '不加薑',
    '不加胡椒',
    '吃素',
    '蛋奶素'
  );

UPDATE specialty_items
SET
  specialty_id = (
    SELECT
      id
    FROM
      specialties
    WHERE
      title = '加量'
  )
WHERE
  title IN ('加10元', '加20元');