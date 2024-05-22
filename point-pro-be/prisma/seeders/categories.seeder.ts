import prisma from '../client';

export function insertCategories() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM categories;
    `,
    prisma.$executeRaw`
      INSERT INTO
        categories (title, position)
      VALUES
        ('熱炒肉類', 1),
        ('熱炒什錦類', 2),
        ('熱炒海鮮類', 3),
        ('三杯類', 4),
        ('鐵板類', 5),
        ('酥炸類', 6),
        ('飯麵類', 7),
        ('青菜類', 8),
        ('火烤類', 9),
        ('火鍋類', 10),
        ('煲類', 11),
        ('湯類', 12),
        ('單點及無酒精飲料', 13);
    `,
  ]);
}
