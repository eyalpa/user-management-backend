import { Schema, model, Types } from "mongoose";

export type UserStatus = "pending" | "active" | "blocked";

export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: UserStatus;
  groupId?: Types.ObjectId | null;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
      required: true
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

UserSchema.index({ groupId: 1 });
UserSchema.index({ status: 1 });

export const User = model<UserDocument>("User", UserSchema);
