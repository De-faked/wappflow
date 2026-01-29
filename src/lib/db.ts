import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const connectionString = process.env.DATABASE_URL!;
// Remove "file:" prefix if present for better-sqlite3
const filename = connectionString.replace(/^file:/, "");

const connection = new Database(filename);
const adapter = new PrismaBetterSqlite(connection);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
