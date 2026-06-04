/* jshint esversion: 6 */
import { Task } from "../models/Task.js";

function buildQuery({ userId, search = "", status = "all" }) {
  const query = { userId };

  if (status !== "all") {
    query.status = status;
  }

  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } }
    ];
  }

  return query;
}

export async function listTasks({ userId, search = "", status = "all", page = 1, limit = 8 }) {
  const safeLimit = Math.max(1, Number(limit) || 8);
  const safePage = Math.max(1, Number(page) || 1);
  const query = buildQuery({ userId, search, status });
  const total = await Task.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();
  const counts = await Task.aggregate([
    { $match: buildQuery({ userId, search, status }) },
    {
      $group: {
        _id: null,
        completedCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        }
      }
    }
  ]);
  const completedCount = counts[0]?.completedCount || 0;
  const pendingCount = total - completedCount;

  return {
    tasks,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    completedCount,
    pendingCount
  };
}

export async function createTask({ title, description = "", status = "pending", userId }) {
  return Task.create({
    title,
    description,
    status,
    userId
  });
}

export async function getTaskById(id) {
  return Task.findById(id);
}

export async function updateTask(id, updates) {
  return Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

export async function removeTask(id) {
  const deleted = await Task.findByIdAndDelete(id);
  return Boolean(deleted);
}
