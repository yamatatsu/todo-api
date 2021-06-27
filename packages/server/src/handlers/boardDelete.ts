import { Handler } from "express";
import getPrisma from "../db";
import { getSub, getBoardParams } from "./lib";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getBoardParams(req);

  if (!params) {
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();

  const board = await prisma.board.findFirst({
    where: { id: params.boardId, author: { sub } },
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
