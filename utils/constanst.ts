import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export const prismaClient = new PrismaClient({
  log: ["query"],
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});
