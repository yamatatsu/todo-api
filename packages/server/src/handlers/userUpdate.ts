import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";
import { getSub } from "./lib";

const bodySchema = zod.object({ name: zod.string() });

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const bodyValidationResult = bodySchema.safeParse(req.body);
  if (!bodyValidationResult.success) {
    res.status(400).json(bodyValidationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const updateResult = await prisma.user.updateMany({
    data: bodyValidationResult.data,
    where: { sub },
  });

  if (updateResult.count === 0) {
    console.info("No users has updated.");
    res.sendStatus(404);
    return;
  }

  res.json(updateResult);
};
export default handler;
