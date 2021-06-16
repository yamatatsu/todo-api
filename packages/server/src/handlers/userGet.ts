import { Handler } from "express";
import getPrisma from "../db";

const handler: Handler = async (req, res) => {
  const sub = req.apiGateway?.event.requestContext.authorizer?.claims.sub;
  if (!sub) {
    // api gatewayを通過したのにsubが無いのはシステムエラー
    throw new Error("No sub was provided.");
  }

  const prisma = await getPrisma();
  const result = await prisma.user.findUnique({
    where: { sub },
  });

  if (!result) {
    res.sendStatus(404);
  } else {
    res.json(result);
  }
};
export default handler;
