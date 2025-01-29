export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '8008');
