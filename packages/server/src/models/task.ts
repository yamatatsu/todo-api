import * as zod from "zod";

const boardIdSchema = zod.number();
const titleSchema = zod.string();
const descriptionSchema = zod.string().optional();
const finishedSchema = zod.boolean();

export const schemaForCreate = zod.object({
  boardId: boardIdSchema,
  title: titleSchema,
  description: descriptionSchema,
});

export const schemaForUpdate = zod.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
});

export const schemaForFinished = zod.object({
  finished: finishedSchema,
});
