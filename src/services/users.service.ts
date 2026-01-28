import mongoose from "mongoose";
import { User, UserStatus } from "../models/user.model";
import { HttpError } from "../utils/httpError";
import { isPopulatedGroup, mapGroup, toIdString } from "../utils/mappers";
import { logger } from "../utils/logger";

export const listUsers = async (
  limit: number,
  offset: number,
  extend: boolean,
  afterId?: string
) => {
  const filter = afterId ? { _id: { $gt: new mongoose.Types.ObjectId(afterId) } } : {};
  logger.info("listUsers service", { limit, offset, extend, afterId });
  const query = User.find(filter)
    .sort({ _id: 1 })
    .skip(afterId ? 0 : offset)
    .limit(limit + 1)
    .select("name email status groupId createdAt");

  if (extend) {
    query.populate({ path: "groupId", select: "name status memberCount" });
  }

  const items = await query.lean();
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;

  const mapped = pageItems.map((item) => {
    const { _id, groupId, ...rest } = item as {
      _id: mongoose.Types.ObjectId;
      groupId?:
        | mongoose.Types.ObjectId
        | { _id: mongoose.Types.ObjectId; name: string; status: string; memberCount: number }
        | null;
      [key: string]: unknown;
    };

    if (extend) {
      const group = isPopulatedGroup(groupId) ? mapGroup(groupId) : null;
      return { id: toIdString(_id), ...rest, group };
    }

    const resolvedGroupId = isPopulatedGroup(groupId) ? groupId._id : groupId;

    return {
      id: toIdString(_id),
      ...rest,
      groupId: resolvedGroupId ? toIdString(resolvedGroupId) : null
    };
  });

  const nextCursor = hasMore ? mapped[mapped.length - 1]?.id ?? null : null;
  logger.info("listUsers result", { count: mapped.length, hasMore });
  return { items: mapped, hasMore, nextCursor };
};

export const updateUserStatuses = async (
  updates: { id: string; status: UserStatus }[]
) => {
  logger.info("updateUserStatuses service", { updatesCount: updates.length });
  const bulkOps = updates.map((update) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(update.id) },
      update: { $set: { status: update.status } }
    }
  }));

  if (bulkOps.length === 0) {
    throw new HttpError(400, "No updates provided");
  }

  const result = await User.bulkWrite(bulkOps, { ordered: false });

  const summary = {
    matched: result.matchedCount,
    modified: result.modifiedCount
  };
  logger.info("updateUserStatuses result", summary);
  return summary;
};
