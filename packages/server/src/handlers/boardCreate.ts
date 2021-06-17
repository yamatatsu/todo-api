import { Handler } from "express";
import { Prisma } from "@prisma/client";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({
  title: zod.string(),
  description: zod.string().optional(),
});

const handler: Handler = async (req, res) => {
  const sub = req.apiGateway?.event.requestContext.authorizer?.claims.sub;
  if (!sub) {
    // api gatewayを通過したのにsubが無いのはシステムエラー
    throw new Error("No sub was provided.");
  }

  const _res = schema.safeParse(req.body);
  if (!_res.success) {
    res.status(400).json(_res.error);
    return;
  }

  const prisma = await getPrisma();

  const user = await prisma.user.findUnique({ where: { sub } });

  if (!user) {
    res.status(400).json({
      message:
        "This user has no user record. It is needed to create a user record.",
    });
    return;
  }

  const result = await prisma.board.create({
    data: {
      authorId: user.id,
      ..._res.data,
    },
  });

  res.json(result);
};
export default handler;
