import { Request, Response, NextFunction } from "express";
import { listGroups, removeUserFromGroup } from "../services";
import { logger } from "../utils/logger";

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset, afterId } = req.query as unknown as {
      limit: number;
      offset: number;
      afterId?: string;
    };
    logger.info("getGroups request", {
      traceId: req.traceId,
      limit,
      offset,
      afterId
    });
    const result = await listGroups(limit, offset, afterId);

    res.status(200).json({
      data: result.items,
      limit,
      offset,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor
    });
    logger.info("getGroups response", {
      traceId: req.traceId,
      count: result.items.length,
      hasMore: result.hasMore
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserFromGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, userId } = req.params as { groupId: string; userId: string };
    logger.info("deleteUserFromGroup request", {
      traceId: req.traceId,
      groupId,
      userId
    });
    await removeUserFromGroup(groupId, userId);
    res.status(204).send();
    logger.info("deleteUserFromGroup response", {
      traceId: req.traceId,
      groupId,
      userId
    });
  } catch (error) {
    next(error);
  }
};
