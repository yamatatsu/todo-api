import { Handler } from "express";
import * as zod from "zod";
import getPrisma from "../db";

const schema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = req.apiGateway?.event.requestContext.authorizer?.claims.sub;
  if (!sub) {
    // api gatewayを通過したのにsubが無いのはシステムエラー
    throw new Error("No sub was provided.");
  }

  const _res = schema.safeParse(req.params);

  if (!_res.success) {
    res.sendStatus(404);
    return;
  }

  const prisma = await getPrisma();
  const result = await prisma.board.findUnique({
    where: { id: _res.data.boardId },
    include: { tasks: true, author: true },
  });

  if (!result) {
    res.sendStatus(404);
    return;
  }

  if (result.author.sub !== sub) {
    // 401を返す実装もあり得るが、404を返すものとする。
    // アクセス権の持たないuserにはリソースの有無を教えない。
    res.sendStatus(404);
    return;
  }

  res.json(result.tasks);
};
export default handler;
