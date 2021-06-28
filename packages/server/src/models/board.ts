import * as zod from "zod";

const authorIdSchema = zod.number();
const titleSchema = zod
  .string()
  .max(50)
  // 改行を許容しない
  .regex(/^[^\n]*$/);
const descriptionSchema = zod.string().max(500);

export const schemaForCreate = zod.object({
  authorId: authorIdSchema,
  title: titleSchema,
  description: descriptionSchema.optional(),
});

export const schemaForUpdate = zod.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
});
