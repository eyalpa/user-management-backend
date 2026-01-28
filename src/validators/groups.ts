import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.isValidObjectId(value), "Invalid id");

export const removeUserFromGroupSchema = z.object({
  params: z.object({
    groupId: objectIdSchema,
    userId: objectIdSchema
  })
});
