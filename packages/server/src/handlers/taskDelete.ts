import { Handler } from "express";
import getPrisma from "../db";
import { getSub, getTaskParams } from "./lib";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getTaskParams(req);

  if (!params) {
    console.info(`Invalid resource path has provided. path: ${req.path}`);
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();

  const result = await prisma.task.deleteMany({
    where: {
      id: params.taskId,
      board: { id: params.boardId, author: { sub } },
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
