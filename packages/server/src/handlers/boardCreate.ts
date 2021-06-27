import { Handler } from "express";
import getPrisma from "../db";
import { getSub } from "./lib";
import { schemaForCreate } from "../models/board";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const prisma = await getPrisma();

  const user = await prisma.user.findUnique({ where: { sub } });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const validationResult = schemaForCreate.safeParse({
    ...req.body,
    authorId: user.id,
  });
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  const board = await prisma.board.create({
    data: validationResult.data,
  });

  res.json({ count: 1 });
};
export default handler;
