import * as zod from "zod";

const boardIdSchema = zod.number();
const titleSchema = zod
  .string()
  .max(50)
  // 改行を許容しない
  .regex(/^[^\n]*$/)
  .transform((name) => name.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
const descriptionSchema = zod
  .string()
  .max(500)
  .transform((name) => name.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
const finishedSchema = zod.boolean();

export const schemaForCreate = zod.object({
  boardId: boardIdSchema,
  title: titleSchema,
  description: descriptionSchema.optional(),
});

export const schemaForUpdate = zod.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
});

export const schemaForFinished = zod.object({
  finished: finishedSchema,
});
