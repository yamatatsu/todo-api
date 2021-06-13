import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({
  sub: zod.string(),
  name: zod.string(),
});

const handler: Handler = async (req, res) => {
  const _res = schema.safeParse(req.body);
  if (!_res.success) {
    res.json(_res.error);
    return;
  }

  const prisma = await getPrisma();
  const result = await prisma.user.create({ data: _res.data });

  res.json(result);
};
export default handler;
