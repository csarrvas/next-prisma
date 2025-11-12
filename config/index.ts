import env from 'env-var';

if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  config();
}

export const envs = {
  // Just development (Docker)
  PORT: env.get('PORT').default('3000').asPortNumber(),
  POSTGRES_USER: env.get('POSTGRES_USER').asString(),
  POSTGRES_PASSWORD: env.get('POSTGRES_PASSWORD').asString(),
  POSTGRES_DB: env.get('POSTGRES_DB').asString(),
  POSTGRES_PORT: env.get('POSTGRES_PORT').default('5432').asPortNumber(),
  // Required in production GitHub Actions
  POSTGRES_URL: env.get('POSTGRES_URL').asString(),
  // Just development (Docker)
  PGADMIN_DEFAULT_PASSWORD: env.get('PGADMIN_DEFAULT_PASSWORD').asString(),
  PGADMIN_DEFAULT_EMAIL: env.get('PGADMIN_DEFAULT_EMAIL').asString(),
  // Environment configuration
  NODE_ENV: env
    .get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production', 'test']),
  // Required in production Vercel
  NEXTAUTH_SECRET: env.get('NEXTAUTH_SECRET').asString(),
  NEXTAUTH_URL: env.get('NEXTAUTH_URL').default('http://localhost:3000').asString(),
};
