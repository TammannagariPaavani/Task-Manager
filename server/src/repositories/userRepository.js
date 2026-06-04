import { isMongoConnected } from "../config/database.js";
import { User } from "../models/User.js";
import {
  createMemoryUser,
  findMemoryUserByEmail,
  findMemoryUserById,
  normalizeEmail
} from "../store/memoryStore.js";

export async function getUserByEmail(email) {
  if (isMongoConnected()) {
    return User.findOne({ email: normalizeEmail(email) });
  }

  return findMemoryUserByEmail(email);
}

export async function getUserById(id) {
  if (isMongoConnected()) {
    return User.findById(id);
  }

  return findMemoryUserById(id);
}

export async function createUser({ name, email, password }) {
  if (isMongoConnected()) {
    return User.create({ name, email: normalizeEmail(email), password });
  }

  return createMemoryUser({ name, email, password });
}

export function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email
  };
}

