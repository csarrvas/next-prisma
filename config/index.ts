import env from 'env-var';

if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');
  config();
}

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  POSTGRES_USER: env.get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: env.get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_DB: env.get('POSTGRES_DB').required().asString(),
  POSTGRES_PORT: env.get('POSTGRES_PORT').required().asPortNumber(),
  POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),
  PGADMIN_DEFAULT_PASSWORD: env.get('PGADMIN_DEFAULT_PASSWORD').required().asString(),
  PGADMIN_DEFAULT_EMAIL: env.get('PGADMIN_DEFAULT_EMAIL').required().asString(),
  NODE_ENV: env.get('NODE_ENV').required().asEnum(['development', 'production', 'test']),
  NEXTAUTH_SECRET: env.get('NEXTAUTH_SECRET').required().asString(),
  NEXTAUTH_URL: env.get('NEXTAUTH_URL').default('http://localhost:3000').asString(),
};
