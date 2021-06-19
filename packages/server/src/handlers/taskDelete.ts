import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";
import { getSub } from "./lib";

const paramSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
  taskId: zod.string().regex(/^\d+$/).transform(Number),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const paramValidationReslt = paramSchema.safeParse(req.params);
  if (!paramValidationReslt.success) {
    console.info(`Invalid resource path has provided. path: ${req.path}`);
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();

  const result = await prisma.task.deleteMany({
    where: {
      id: paramValidationReslt.data.taskId,
      board: { id: paramValidationReslt.data.boardId, author: { sub } },
    },
  });
  if (result.count === 0) {
    console.info("No tasks has deleted.");
    res.sendStatus(404);
    return;
  }

  res.json(result);
};
export default handler;
