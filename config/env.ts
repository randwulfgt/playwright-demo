/**
 * Environment configuration.
 * Optional: values can be overridden via .env (loaded in playwright.config.ts via dotenv).
 * Demo site credentials are used by default.
 */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://qa-practice.razvanvancea.ro',
  credentials: {
    email: process.env.LOGIN_EMAIL ?? 'admin@admin.com',
    password: process.env.LOGIN_PASSWORD ?? 'admin123',
  },
};
