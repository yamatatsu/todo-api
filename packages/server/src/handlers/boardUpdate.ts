import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});
const bodyschema = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
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

  const bodyValidationResult = bodyschema.safeParse(req.body);
  if (!bodyValidationResult.success) {
    res.status(400).json(bodyValidationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const updateResult = await prisma.board.updateMany({
    data: {
      ...bodyValidationResult.data,
    },
    where: { id: paramValidationReslt.data.boardId, author: { sub } },
  });

  if (updateResult.count === 0) {
    console.info("No boards has updated.");
    res.sendStatus(404);
    return;
  }

  res.json(updateResult);
};
export default handler;
