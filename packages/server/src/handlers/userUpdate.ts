import { Handler } from "express";
import getPrisma from "../db";
import { getSub } from "./lib";
import { schemaForUpdate } from "../models/user";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const validationResult = schemaForUpdate.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  const prisma = await getPrisma();

  const updateResult = await prisma.user.updateMany({
    data: validationResult.data,
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
