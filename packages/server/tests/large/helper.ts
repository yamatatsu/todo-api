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

export const sampleUuid = "ccb4e9ba-ce25-410f-bfbe-7cd55cc09a57";
export const sampleUuid2 = "ccb4e9ba-ce25-410f-bfbe-7cd55cc09a58";

export const createUser1 = async (prisma: PrismaClient) => {
  const user = await prisma.user.create({
    data: {
      sub: sampleUuid,
      name: "test-user-name1",
      boards: {
        create: [
          {
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
                {
                  title: "DONEしたtask",
                  description: "DONEしたtask",
                  finished: true,
                },
                {
                  title: "DONEしたtask",
                  description: "DONEしたtask 検索用キー:わかめ",
                  finished: true,
                },
              ],
            },
          },
          {
            title: "test-board-title2",
            tasks: { create: [{ title: "よそのBoardのタスク" }] },
          },
        ],
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const board2 = user.boards[1];
  const tasks = board.tasks;

  return {
    user: omit(user, ["boards"]),
    board: omit(board, ["tasks"]),
    tasks,
    board2: omit(board2, ["tasks"]),
  };
};

export const createUser2 = async (prisma: PrismaClient) => {
  const user = await prisma.user.create({
    data: {
      sub: sampleUuid2,
      name: "test-user-name2",
    },
  });
  return {
    user,
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
