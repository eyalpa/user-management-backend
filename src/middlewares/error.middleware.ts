import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const traceId = _req.traceId;
  const payload = {
    message: err.message || "Internal server error",
    ...(err instanceof HttpError && err.details ? { details: err.details } : {})
  };

  logger.error("request error", {
    traceId,
    statusCode,
    message: payload.message,
    details: err instanceof HttpError ? err.details : undefined,
    stack: err.stack
  });
  res.status(statusCode).json(payload);
};
