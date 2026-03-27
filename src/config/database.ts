import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

// ================================
// PRISMA CLIENT SINGLETON (Prisma v7)
//
// Prisma 7 removed the built-in Rust engine.
// You now MUST pass a driver adapter to PrismaClient.
// For PostgreSQL we use @prisma/adapter-pg which wraps
// the standard `pg` (node-postgres) library.
//
// We keep a singleton so we don't create a new connection
// pool on every hot-reload in development.
// ================================

const createPrismaClient = () => {
  // PrismaPg manages a connection pool internally using DATABASE_URL
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
};

// Extend globalThis to hold our prisma instance in dev
declare global {
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};
