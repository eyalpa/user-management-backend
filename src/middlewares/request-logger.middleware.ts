import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const traceId = req.header("x-trace-id") || randomUUID();
  req.traceId = traceId;
  res.setHeader("x-trace-id", traceId);

  const start = Date.now();
  const safeHeaders = { ...req.headers };
  delete safeHeaders.authorization;
  delete safeHeaders.cookie;

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      traceId,
      durationMs,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      params: req.params,
      query: req.query,
      headers: safeHeaders,
      body: req.method === "GET" ? undefined : req.body
    });
  });

  next();
};
