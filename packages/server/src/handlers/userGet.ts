import { Handler } from "express";
import getPrisma from "../db";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

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
    return;
  }

  res.json(result);
};
export default handler;
