import { Handler } from "express";
import { Prisma } from "@prisma/client";
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

  let result;
  try {
    result = await prisma.user.update({
      data: bodyValidationResult.data,
      where: { sub },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.sendStatus(404);
        return;
      }
    }
    throw error;
  }

  res.json(result);
};
export default handler;
