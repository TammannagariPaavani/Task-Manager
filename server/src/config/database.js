import mongoose from "mongoose";

export async function initializeDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}
