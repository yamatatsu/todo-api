import { Handler } from "express";
import { Prisma } from "@prisma/client";
import * as zod from "zod";
import getPrisma from "../db";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});
const schema = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
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

  const _res = schema.safeParse(req.body);
  if (!_res.success) {
    res.status(400).json(_res.error);
    return;
  }

  const prisma = await getPrisma();

  const result = await prisma.board.updateMany({
    data: {
      ..._res.data,
    },
    where: { id: paramValidationReslt.data.boardId, author: { sub } },
  });

  if (result.count === 0) {
    console.info("No boards has updated.");
    res.sendStatus(404);
    return;
  }

  res.json(result);
};
export default handler;
