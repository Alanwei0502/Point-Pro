import prisma from '../client';

export function insertOrders() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM orders;
    `,
  ]);
}
