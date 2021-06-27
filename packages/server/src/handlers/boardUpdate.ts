import { Handler } from "express";
import getPrisma from "../db";
import { getSub, getBoardParams } from "./lib";
import { schemaForUpdate } from "../models/board";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getBoardParams(req);

  if (!params) {
    res.sendStatus(404);
    return;
  }

  const validationResult = schemaForUpdate.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const updateResult = await prisma.board.updateMany({
    data: {
      ...validationResult.data,
    },
    where: { id: params.boardId, author: { sub } },
  });

  if (updateResult.count === 0) {
    console.info("No boards has updated.");
    res.sendStatus(404);
    return;
  }

  res.json(updateResult);
};
export default handler;
