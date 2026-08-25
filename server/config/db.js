import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // In a serverless context we don't want to hard-exit the process
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw err;
  }
};

export default connectDB; // ✅ ES Module export
