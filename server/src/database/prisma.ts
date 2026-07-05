import { PrismaClient } from "@prisma/client";

import { env } from "../config/env";

// Prevents creating a new PrismaClient (and new connection pool) on every
// ts-node-dev hot-reload during development.
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
