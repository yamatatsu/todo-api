import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";
import { getSub, getBoardParams } from "./lib";

const querySchema = zod.object({
  keyword: zod.string().optional(),
  finished: zod
    .string()
    .transform((finished) => {
      switch (finished.toLowerCase()) {
        case "true":
          return true;
        case "false":
          return false;
        default:
          return Boolean(finished);
      }
    })
    .optional(),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getBoardParams(req);

  if (!params) {
    console.info(`Invalid resource path has provided. path: ${req.path}`);
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();
  const board = await prisma.board.findFirst({
    where: { id: params.boardId, author: { sub } },
  });

  if (!board) {
    res.sendStatus(404);
    return;
  }

  const queryValidationReslt = querySchema.safeParse(req.query);
  if (!queryValidationReslt.success) {
    res.status(400).json(queryValidationReslt.error);
    return;
  }
  const { keyword, finished = false } = queryValidationReslt.data;

  const keywordQuery = keyword
    ? {
        OR: [
          { title: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : {};

  const tasks = await prisma.task.findMany({
    where: {
      boardId: board.id,
      finished,
      ...keywordQuery,
    },
  });

  res.json(tasks);
};
export default handler;
