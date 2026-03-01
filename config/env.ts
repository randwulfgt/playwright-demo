/**
 * Environment configuration from .env
 * Values are loaded in playwright.config.ts via dotenv
 * Credentials must be set in .env (see .env.example)
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Add it to your .env file (see .env.example).`);
  }
  return value;
}

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://qa-practice.razvanvancea.ro',
  credentials: {
    email: requireEnv('LOGIN_EMAIL'),
    password: requireEnv('LOGIN_PASSWORD'),
  },
};
