import prisma from '../client';

export function insertSpecialtyItems() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM specialty_items;
    `,
    prisma.$executeRaw`
      INSERT INTO
        specialty_items (title, price, position)
      VALUES
        ('不辣', 0, 1),
        ('小辣', 0, 2),
        ('中辣', 0, 3),
        ('大辣', 0, 4),
        ('少油', 0, 5),
        ('少鹽', 0, 6),
        ('無味素', 0, 7),
        ('不加蔥', 0, 8),
        ('不加洋蔥', 0, 9),
        ('不加香菜', 0, 10),
        ('不加薑', 0, 11),
        ('不加胡椒', 0, 12),
        ('吃素', 0, 13),
        ('蛋奶素', 0, 14),
        ('加10元', 10, 15),
        ('加20元', 20, 16);
    `,
    prisma.$executeRaw`
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
    `,
    prisma.$executeRaw`
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
    `,
    prisma.$executeRaw`
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
    `,
  ]);
}
