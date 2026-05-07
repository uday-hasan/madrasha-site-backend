import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// ================================
// PRISMA CONFIG (required in Prisma v7)
// In Prisma 7, the database URL moves OUT of schema.prisma
// and into this file. schema.prisma only defines models now.
// ================================

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'bun ./prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
