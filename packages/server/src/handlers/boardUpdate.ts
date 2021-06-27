import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";
import { getSub, getBoardParams } from "./lib";

const bodyschema = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);
  const params = getBoardParams(req);

  if (!params) {
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
