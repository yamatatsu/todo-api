import { Handler } from "express";
import getPrisma from "../db";
import { getSub, getTaskParams } from "./lib";
import { schemaForFinished } from "../models/task";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getTaskParams(req);

  if (!params) {
    console.info(`Invalid resource path has provided. path: ${req.path}`);
    res.sendStatus(404);
    return;
  }

  const validationResult = schemaForFinished.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const result = await prisma.task.updateMany({
    data: validationResult.data,
    where: {
      id: params.taskId,
      board: { id: params.boardId, author: { sub } },
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
