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

export const getXApigatewayEvent = (sub: string) =>
  JSON.stringify({
    requestContext: { authorizer: { claims: { sub } } },
  });

export const createUser1 = async (prisma: PrismaClient) => {
  const user = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
          tasks: {
            create: [
              {
                title: "りんご いちご ぶどう",
                description: "りんご ばなな ぶどう",
              },
              {
                title: "りんご ばなな ぶどう",
                description: "りんご ばなな ぶどう",
              },
              {
                title: "りんご ばなな ぶどう",
                description: "りんご いちご ぶどう",
              },
            ],
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const tasks = board.tasks;

  return {
    user: omit(user, ["boards"]),
    board: omit(board, ["tasks"]),
    tasks,
  };
};

const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  keys: K
): Omit<T, K[number]> => {
  const ret = {} as T;
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};
