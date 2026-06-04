import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";
import { getUserById, toPublicUser } from "../repositories/userRepository.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized. Token missing." });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "Not authorized. User not found." });
    }

    req.user = toPublicUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized. Invalid token." });
  }
}
