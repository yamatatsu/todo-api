import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";
import { getSub } from "./lib";

const bodySchema = zod.object({
  title: zod.string(),
  description: zod.string().optional(),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const bodyValidationResult = bodySchema.safeParse(req.body);
  if (!bodyValidationResult.success) {
    res.status(400).json(bodyValidationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const user = await prisma.user.findUnique({ where: { sub } });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const board = await prisma.board.create({
    data: {
      authorId: user.id,
      ...bodyValidationResult.data,
    },
  });

  res.json({ count: 1 });
};
export default handler;
