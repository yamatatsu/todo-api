import { Handler } from "express";
import getPrisma from "../db";
import { getSub } from "./lib";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const prisma = await getPrisma();

  const user = await prisma.user.findUnique({
    where: { sub },
    include: { boards: true },
  });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.json(user);
};
export default handler;
