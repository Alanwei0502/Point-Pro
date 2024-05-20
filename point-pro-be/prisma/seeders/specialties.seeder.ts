import prisma from '../client';

export function insertSpecialties() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM specialties;
    `,
    prisma.$executeRaw`
      INSERT INTO
        specialties (title, selection_type)
      VALUES
        ('辣度', 'SINGLE'),
        ('特別調整', 'MULTIPLE'),
        ('加量', 'SINGLE');
    `,
  ]);
}
