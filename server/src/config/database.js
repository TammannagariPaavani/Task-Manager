import mongoose from "mongoose";

let mongoConnected = false;

export async function initializeDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    mongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    mongoConnected = true;
    return true;
  } catch (error) {
    mongoConnected = false;
    console.warn("MongoDB connection failed. Falling back to demo mode.");
    console.warn(error.message);
    return false;
  }
}

export function isMongoConnected() {
  return mongoConnected;
}

