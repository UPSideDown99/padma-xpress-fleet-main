// lib/db.ts
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"], // tambah "query" kalau mau debug
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
