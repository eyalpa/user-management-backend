import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.isValidObjectId(value), "Invalid id");

const paginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 20))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 0))
    .pipe(z.number().int().min(0)),
  extend: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return false;
      return val === "true" || val === "1";
    })
    .pipe(z.boolean()),
  afterId: objectIdSchema.optional()
});

export const paginationSchema = z.object({
  query: paginationQuerySchema
});
