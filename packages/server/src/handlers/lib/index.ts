import { Request } from "express";
import * as zod from "zod";

export const getSub = (req: Request): string => {
  const sub = req.apiGateway?.event.requestContext.authorizer?.claims.sub;
  if (!sub) {
    // api gatewayを通過したのにsubが無いのはシステムエラー
    throw new Error("No sub was provided.");
  }
  return sub;
};

const boardParamSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
});
export function getBoardParams(req: Request): { boardId: number } | null {
  const paramValidationReslt = boardParamSchema.safeParse(req.params);
  if (!paramValidationReslt.success) {
    return null;
  }
  return paramValidationReslt.data;
}

const taskParamSchema = zod.object({
  boardId: zod.string().regex(/^\d+$/).transform(Number),
  taskId: zod.string().regex(/^\d+$/).transform(Number),
});
export function getTaskParams(
  req: Request
): { taskId: number; boardId: number } | null {
  const paramValidationReslt = taskParamSchema.safeParse(req.params);
  if (!paramValidationReslt.success) {
    return null;
  }
  return paramValidationReslt.data;
}
