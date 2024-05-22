import prisma from '../client';

export function insertSpecialties() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM specialties;
    `,
    prisma.$executeRaw`
      INSERT INTO
        specialties (title, selection_type, position)
      VALUES
        ('辣度', 'SINGLE', 1),
        ('特別調整', 'MULTIPLE', 2),
        ('加量', 'SINGLE', 3);
    `,
  ]);
}
