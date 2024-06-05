import prisma from '../client';

export function insertSpecialtyItems() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM specialty_items;
    `,
    prisma.$executeRaw`
      DO $$
      DECLARE
          spicy_specialty_id UUID;
          speical_specialty_id UUID;
          add_amount_specialty_id UUID;
      BEGIN
      SELECT id INTO spicy_specialty_id FROM specialties WHERE title = '辣度';
      SELECT id INTO speical_specialty_id FROM specialties WHERE title = '特別調整';
      SELECT id INTO add_amount_specialty_id FROM specialties WHERE title = '加量';
      INSERT INTO
        specialty_items (title, price, position, specialty_id)
      VALUES
        ('不辣', 0, 1, spicy_specialty_id),
        ('小辣', 0, 2, spicy_specialty_id),
        ('中辣', 0, 3, spicy_specialty_id),
        ('大辣', 0, 4, spicy_specialty_id),
        ('少油', 0, 5, speical_specialty_id),
        ('少鹽', 0, 6, speical_specialty_id),
        ('無味素', 0, 7, speical_specialty_id),
        ('不加蔥', 0, 8, speical_specialty_id),
        ('不加洋蔥', 0, 9, speical_specialty_id),
        ('不加香菜', 0, 10, speical_specialty_id),
        ('不加薑', 0, 11, speical_specialty_id),
        ('不加胡椒', 0, 12, speical_specialty_id),
        ('吃素', 0, 13, speical_specialty_id),
        ('蛋奶素', 0, 14, speical_specialty_id),
        ('加量10元', 10, 15, add_amount_specialty_id),
        ('加量20元', 20, 16, add_amount_specialty_id);
      END $$;
    `,
  ]);
}
