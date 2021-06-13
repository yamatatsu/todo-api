import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({
  id: zod.string().regex(/^\d+$/),
});

const handler: Handler = async (req, res) => {
  const _res = schema.safeParse(req.params);

  if (!_res.success) {
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();
  const result = await prisma.user.findUnique({
    where: { id: parseInt(_res.data.id) },
  });

  if (!result) {
    res.sendStatus(404);
  } else {
    res.json(result);
  }
};
export default handler;
