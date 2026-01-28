import { Request, Response, NextFunction } from "express";
import { runSeed } from "../scripts/seed";
import { logger } from "../utils/logger";

export const seedDatabase = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("seedDatabase request", { traceId: _req.traceId });
    await runSeed();
    res.status(200).json({ message: "Seed completed" });
    logger.info("seedDatabase response", { traceId: _req.traceId });
  } catch (error) {
    next(error);
  }
};
