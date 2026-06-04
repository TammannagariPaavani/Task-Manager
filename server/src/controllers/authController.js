import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createUser, getUserByEmail, toPublicUser } from "../repositories/userRepository.js";

function signToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "7d"
  });
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken(user._id);

  res.status(201).json({
    user: toPublicUser(user),
    token
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user._id);

  res.json({
    user: toPublicUser(user),
    token
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
