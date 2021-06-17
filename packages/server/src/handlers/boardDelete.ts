import { Handler } from "express";
import { Prisma } from "@prisma/client";
import * as zod from "zod";
import getPrisma from "../db";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});

const handler: Handler = async (req, res) => {
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

  const result = await prisma.board.deleteMany({
    where: { id: paramValidationReslt.data.boardId, author: { sub } },
  });

  if (result.count === 0) {
    console.info("No boards has deleted.");
    res.sendStatus(404);
    return;
  }

  res.json(result);
};
export default handler;
