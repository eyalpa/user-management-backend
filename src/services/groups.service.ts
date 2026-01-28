import mongoose from "mongoose";
import { Group, User } from "../models";
import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

export const listGroups = async (limit: number, offset: number, afterId?: string) => {
  const filter = afterId ? { _id: { $gt: new mongoose.Types.ObjectId(afterId) } } : {};
  logger.info("listGroups service", { limit, offset, afterId });
  const items = await Group.find(filter)
    .sort({ _id: 1 })
    .skip(afterId ? 0 : offset)
    .limit(limit + 1)
    .select("name status memberCount createdAt")
    .lean();

  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;

  const mapped = pageItems.map((item) => {
    const { _id, ...rest } = item as { _id: mongoose.Types.ObjectId; [key: string]: unknown };
    return { id: String(_id), ...rest };
  });

  const nextCursor = hasMore ? mapped[mapped.length - 1]?.id ?? null : null;
  logger.info("listGroups result", { count: mapped.length, hasMore });
  return { items: mapped, hasMore, nextCursor };
};

export const removeUserFromGroup = async (groupId: string, userId: string) => {
  logger.info("removeUserFromGroup service", { groupId, userId });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const group = await Group.findById(groupObjectId).session(session);
    if (!group) {
      throw new HttpError(404, "Group not found");
    }

    const userUpdate = await User.updateOne(
      { _id: userObjectId, groupId: groupObjectId },
      { $set: { groupId: null } },
      { session }
    );

    if (userUpdate.matchedCount === 0) {
      throw new HttpError(404, "User not found in this group");
    }

    await group.updateOne(
      [
        {
          $set: {
            memberCount: {
              $max: [0, { $subtract: ["$memberCount", 1] }]
            },
            status: {
              $cond: [
                { $lte: [{ $subtract: ["$memberCount", 1] }, 0] },
                "empty",
                "notEmpty"
              ]
            }
          }
        }
      ],
      { session }
    );

    await session.commitTransaction();
    logger.info("removeUserFromGroup success", { groupId, userId });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
