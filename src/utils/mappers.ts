import mongoose from "mongoose";

export const toIdString = (value: mongoose.Types.ObjectId) => String(value);

export const mapGroup = (group: {
  _id: mongoose.Types.ObjectId;
  name: string;
  status: string;
  memberCount: number;
}) => ({
  id: toIdString(group._id),
  name: group.name,
  status: group.status,
  memberCount: group.memberCount
});

export const isPopulatedGroup = (
  value: unknown
): value is {
  _id: mongoose.Types.ObjectId;
  name: string;
  status: string;
  memberCount: number;
} =>
  typeof value === "object" &&
  value !== null &&
  "_id" in value &&
  (value as { _id: unknown })._id instanceof mongoose.Types.ObjectId;
