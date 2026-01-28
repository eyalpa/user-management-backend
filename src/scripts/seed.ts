import mongoose from "mongoose";
import { loadEnv } from "../config/env";
import { connectDb } from "../config/db";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";

export const runSeed = async () => {
  loadEnv();
  await connectDb();

  await Promise.all([User.deleteMany({}), Group.deleteMany({})]);

  const groups = await Group.insertMany([
    { name: "Admins", status: "empty", memberCount: 0 },
    { name: "Users", status: "empty", memberCount: 0 }
  ]);

  const users = await User.insertMany([
    { name: "John Doe", email: "john@example.com", status: "active", groupId: groups[0]._id },
    { name: "Jane Smith", email: "jane@example.com", status: "pending", groupId: groups[1]._id },
    { name: "No Group User", email: "nogroup@example.com", status: "blocked", groupId: null }
  ]);

  const counts = await User.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
    { $match: { groupId: { $ne: null } } },
    { $group: { _id: "$groupId", count: { $sum: 1 } } }
  ]);

  const bulkOps = counts.map((entry) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: {
        $set: {
          memberCount: entry.count,
          status: (entry.count > 0 ? "notEmpty" : "empty") as "notEmpty" | "empty"
        }
      }
    }
  }));

  if (bulkOps.length > 0) {
    await Group.bulkWrite(bulkOps);
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${groups.length} groups and ${users.length} users.`);
  await mongoose.connection.close();
};

if (require.main === module) {
  runSeed().catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  });
}
