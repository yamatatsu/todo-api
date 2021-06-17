import { Handler } from "express";
import { Prisma } from "@prisma/client";
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

  let result;
  try {
    result = await prisma.user.update({
      data: _res.data,
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
