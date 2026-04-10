// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log(">>> DATABASE_URL:", JSON.stringify(process.env.DATABASE_URL));

const raw = process.env.DATABASE_URL ?? "";
console.log(
  "DATABASE_URL:",
  raw ? raw.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@") : "VACIA"
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
