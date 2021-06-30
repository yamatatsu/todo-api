import * as zod from "zod";

const authorIdSchema = zod.number();
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

export const schemaForCreate = zod.object({
  authorId: authorIdSchema,
  title: titleSchema,
  description: descriptionSchema.optional(),
});

export const schemaForUpdate = zod.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
});
