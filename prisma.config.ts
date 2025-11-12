import { defineConfig } from 'prisma/config';
import { envs } from './config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: envs.POSTGRES_URL!,
  },
});
