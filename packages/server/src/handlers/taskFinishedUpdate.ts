import { Handler } from "express";
import { Prisma } from "@prisma/client";
import * as zod from "zod";
import getPrisma from "../db";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
  taskId: zod.string().regex(/^\d+$/).transform(Number),
});
const schema = zod.object({
  finished: zod.boolean(),
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
    console.info(`Invalid resource path has provided. path: ${req.path}`);
    res.sendStatus(404);
    return;
  }

  const _res = schema.safeParse(req.body);
  if (!_res.success) {
    res.status(400).json(_res.error);
    return;
  }

  const prisma = await getPrisma();

  const result = await prisma.task.updateMany({
    data: {
      ..._res.data,
    },
    where: {
      id: paramValidationReslt.data.taskId,
      board: { id: paramValidationReslt.data.boardId, author: { sub } },
    },
  });
  if (result.count === 0) {
    console.info("No tasks has updated.");
    res.sendStatus(404);
    return;
  }

  res.json(result);
};
export default handler;
