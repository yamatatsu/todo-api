import * as zod from "zod";

const subSchema = zod.string();
const nameSchema = zod.string();

export const schemaForCreate = zod.object({
  sub: subSchema,
  name: nameSchema,
});

export const schemaForUpdate = zod.object({
  name: nameSchema.optional(),
});
