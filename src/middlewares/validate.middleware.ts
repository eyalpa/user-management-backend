import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { HttpError } from "../utils/httpError";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));
      return next(new HttpError(400, "Validation failed", details));
    }

    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    req.params = result.data.params ?? req.params;

    return next();
  };
