import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({ name: zod.string() });

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

  const result = await prisma.user.create({
    data: {
      ..._res.data,
      sub,
      boards: {
        create: {
          title: "Default",
          tasks: { create: { title: "Great Awesome Tutorial" } },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });
  res.json(result);
};
export default handler;
