import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = req.apiGateway?.event.requestContext.authorizer?.claims.sub;
  if (!sub) {
    // api gatewayを通過したのにsubが無いのはシステムエラー
    throw new Error("No sub was provided.");
  }

  const paramValidationReslt = paramSchema.safeParse(req.params);
  if (!paramValidationReslt.success) {
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();

  const board = await prisma.board.findFirst({
    where: { id: paramValidationReslt.data.boardId, author: { sub } },
  });
  if (!board) {
    console.info("No boards has found.");
    res.sendStatus(404);
    return;
  }

  const [, result] = await prisma.$transaction([
    prisma.task.deleteMany({ where: { boardId: board.id } }),
    prisma.board.deleteMany({ where: { id: board.id } }),
  ]);

  res.json(result);
};
export default handler;
