import mongoose from "mongoose";
export default async function initConnect() {
  // const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_db";
  const MONGO_URI = "mongodb+srv://user:jynNCC98l48BSqlu@cluster0.zxx7y06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection.connection.db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}