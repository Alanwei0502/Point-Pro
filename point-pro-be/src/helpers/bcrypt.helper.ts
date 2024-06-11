import bcrypt from 'bcryptjs';

export const hashPassword = (phone: string) => {
  // Hash password with bcrypt
  if (!process.env.JWT_SALT_ROUND) throw new Error('No Salt Round');
  const passwordHash = bcrypt.hashSync(phone, Number(process.env.JWT_SALT_ROUND));
  return passwordHash;
};
