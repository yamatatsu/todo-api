import { Handler } from "express";
import getPrisma from "../db";
import { getSub, getBoardParams } from "./lib";
import { schemaForCreate } from "../models/task";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getBoardParams(req);
  if (params === null) {
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

  const validationResult = schemaForCreate.safeParse({
    boardId: params.boardId,
    ...req.body,
  });
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  await prisma.task.create({ data: validationResult.data });

  res.json({ count: 1 });
};
export default handler;
