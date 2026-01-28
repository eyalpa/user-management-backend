import { Request, Response, NextFunction } from "express";
import { listUsers, updateUserStatuses } from "../services";
import { logger } from "../utils/logger";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset, extend, afterId } = req.query as unknown as {
      limit: number;
      offset: number;
      extend: boolean;
      afterId?: string;
    };
    logger.info("getUsers request", {
      traceId: req.traceId,
      limit,
      offset,
      extend,
      afterId
    });
    const result = await listUsers(limit, offset, extend, afterId);

    res.status(200).json({
      data: result.items,
      limit,
      offset,
      extend,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor
    });
    logger.info("getUsers response", {
      traceId: req.traceId,
      count: result.items.length,
      hasMore: result.hasMore
    });
  } catch (error) {
    next(error);
  }
};

export const patchUsersStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updates } = req.body as {
      updates: { id: string; status: "pending" | "active" | "blocked" }[];
    };

    logger.info("patchUsersStatuses request", {
      traceId: req.traceId,
      updatesCount: updates.length
    });
    const result = await updateUserStatuses(updates);

    res.status(200).json({
      matched: result.matched,
      modified: result.modified
    });
    logger.info("patchUsersStatuses response", {
      traceId: req.traceId,
      matched: result.matched,
      modified: result.modified
    });
  } catch (error) {
    next(error);
  }
};
