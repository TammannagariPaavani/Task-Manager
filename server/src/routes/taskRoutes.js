import { Router } from "express";
import { addTask, deleteTask, editTask, fetchTasks, toggleTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", fetchTasks);
router.post("/", addTask);
router.put("/:id", editTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;

