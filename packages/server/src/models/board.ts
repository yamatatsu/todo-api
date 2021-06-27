import * as zod from "zod";

const userIdSchema = zod.number();
const titleSchema = zod.string();
const descriptionSchema = zod.string().optional();

export const schemaForCreate = zod.object({
  authorId: userIdSchema,
  title: titleSchema,
  description: descriptionSchema,
});

export const schemaForUpdate = zod.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
});
