import { User } from "../models/User.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function getUserByEmail(email) {
  return User.findOne({ email: normalizeEmail(email) });
}

export async function getUserById(id) {
  return User.findById(id);
}

export async function createUser({ name, email, password }) {
  return User.create({ name, email: normalizeEmail(email), password });
}

export function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id || user.id),
    name: user.name,
    email: normalizeEmail(user.email)
  };
}
