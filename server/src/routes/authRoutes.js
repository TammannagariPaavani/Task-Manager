import { Router } from "express";
import { getProfile, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);

export default router;

