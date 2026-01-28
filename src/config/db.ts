import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/user_management";
  await mongoose.connect(uri);
};
