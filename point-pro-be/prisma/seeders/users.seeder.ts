import { Gender, Role } from '@prisma/client';
import prisma from '../client';
import { hashPassword } from './../../src/helpers/bcrypt.helper';

export async function insertUsers() {
  await prisma.user.deleteMany();

  const data = [
    {
      username: 'admin',
      phone: '0987654321',
      email: 'admin@example',
      gender: Gender.MALE,
      role: Role.ADMIN,
      passwordHash: hashPassword('0987654321'),
    },
    {
      username: 'staff1',
      phone: '0987654322',
      email: 'staff1@example',
      gender: Gender.FEMALE,
      role: Role.STAFF,
      passwordHash: hashPassword('0987654322'),
    },
    {
      username: 'staff2',
      phone: '0987654323',
      email: 'staff2@example',
      gender: Gender.OTHER,
      role: Role.STAFF,
      passwordHash: hashPassword('0987654323'),
    },
  ];
  return await prisma.user.createMany({ data });
}
