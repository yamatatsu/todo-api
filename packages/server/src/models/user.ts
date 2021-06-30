import * as zod from "zod";

const subSchema = zod.string().uuid();
const nameSchema = zod
  .string()
  .max(60)
  // 改行を許容しない
  .regex(/^[^\n]*$/)
  .transform((name) => name.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
export const schemaForCreate = zod.object({
  sub: subSchema,
  name: nameSchema,
});

export const schemaForUpdate = zod.object({
  name: nameSchema.optional(),
});
