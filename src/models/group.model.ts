import { Schema, model, Types } from "mongoose";

export type GroupStatus = "empty" | "notEmpty";

export interface GroupDocument {
  _id: Types.ObjectId;
  name: string;
  status: GroupStatus;
  memberCount: number;
  createdAt: Date;
}

const GroupSchema = new Schema<GroupDocument>(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["empty", "notEmpty"],
      default: "empty",
      required: true
    },
    memberCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

GroupSchema.index({ status: 1 });

export const Group = model<GroupDocument>("Group", GroupSchema);
