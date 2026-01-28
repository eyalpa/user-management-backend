import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.isValidObjectId(value), "Invalid id");

export const bulkStatusSchema = z.object({
  body: z.object({
    updates: z
      .array(
        z.object({
          id: objectIdSchema,
          status: z.enum(["pending", "active", "blocked"])
        })
      )
      .min(1)
      .max(500)
  })
});
