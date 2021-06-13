import { PrismaClient } from "@prisma/client";
import getPrisma from "../../src/db";

export function setupPrisma() {
  const prisma = new PrismaClient();

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.task.deleteMany(),
      prisma.board.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });
  afterAll(async () => {
    await prisma.$transaction([
      prisma.task.deleteMany(),
      prisma.board.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    await prisma.$disconnect();
    await getPrisma().then((_prisma) => _prisma.$disconnect());
  });
  return prisma;
}
