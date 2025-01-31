import bcrypt from 'bcrypt';

export const hashValue = async (value: string, saltRound?: number) =>
  await bcrypt.hash(value, saltRound || 10);

export const compareValue = async (value: string, hash: string) =>
  await bcrypt.compare(value, hash).catch(() => false);
