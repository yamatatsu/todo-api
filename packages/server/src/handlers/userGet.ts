import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({
  id: zod.string(),
});

const handler: Handler = async (req, res) => {
  const { id } = schema.parse(req.params);

  const prisma = await getPrisma();
  const result = await prisma.user.findFirst({ where: { id: parseInt(id) } });
  res.send(result);
};
export default handler;
