import bcrypt from 'bcrypt';

export const hashValue = async (value: string, saltRound?: number) =>
  await bcrypt.hash(value, saltRound || 10);
