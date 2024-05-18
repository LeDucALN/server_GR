import mongoose from "mongoose";
export default async function initConnect() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_db";
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    return connection.connection.db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}