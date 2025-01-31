export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '8008');
export const APP_ORIGIN = getEnv('APP_ORIGIN');
export const JWT_SECRET = getEnv('JWT_SECRET');
export const JWT_REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET');
export const NODE_ENV = getEnv('NODE_ENV');
