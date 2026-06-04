import { asyncHandler } from "../utils/asyncHandler.js";
import { createTask, getTaskById, listTasks, removeTask, updateTask } from "../repositories/taskRepository.js";

function assertTaskOwnership(task, userId) {
  return task && String(task.userId) === String(userId);
}

export const fetchTasks = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const search = req.query.search || "";
  const status = req.query.status || "all";

  const result = await listTasks({
    userId: req.user.id,
    search,
    status,
    page,
    limit
  });

  res.json(result);
});

export const addTask = asyncHandler(async (req, res) => {
  const { title, description = "", status = "pending" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required." });
  }

  const task = await createTask({
    title: title.trim(),
    description: description.trim(),
    status: status === "completed" ? "completed" : "pending",
    userId: req.user.id
  });

  res.status(201).json(task);
});

export const editTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!assertTaskOwnership(task, req.user.id)) {
    return res.status(404).json({ message: "Task not found." });
  }

  const updates = {};

  if (typeof req.body.title === "string") {
    updates.title = req.body.title.trim();
  }
  if (typeof req.body.description === "string") {
    updates.description = req.body.description.trim();
  }
  if (typeof req.body.status === "string" && ["pending", "completed"].includes(req.body.status)) {
    updates.status = req.body.status;
  }

  if (updates.title !== undefined && !updates.title) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }

  const updatedTask = await updateTask(req.params.id, updates);
  res.json(updatedTask);
});

export const toggleTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!assertTaskOwnership(task, req.user.id)) {
    return res.status(404).json({ message: "Task not found." });
  }

  const nextStatus = task.status === "completed" ? "pending" : "completed";
  const updatedTask = await updateTask(req.params.id, { status: nextStatus });
  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (!assertTaskOwnership(task, req.user.id)) {
    return res.status(404).json({ message: "Task not found." });
  }

  await removeTask(req.params.id);
  res.json({ message: "Task deleted successfully." });
});

