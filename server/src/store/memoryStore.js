import crypto from "node:crypto";

const users = [];
const tasks = [];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function createMemoryUser({ name, email, password }) {
  const user = {
    _id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizeEmail(email),
    password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(user);
  return clone(user);
}

export function findMemoryUserByEmail(email) {
  const user = users.find((item) => item.email === normalizeEmail(email));
  return user ? clone(user) : null;
}

export function findMemoryUserById(id) {
  const user = users.find((item) => item._id === id);
  return user ? clone(user) : null;
}

export function createMemoryTask({ title, description = "", status = "pending", userId }) {
  const task = {
    _id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    status,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(task);
  return clone(task);
}

export function listMemoryTasks({ userId, search = "", status = "all", page = 1, limit = 8 }) {
  const normalizedSearch = search.trim().toLowerCase();

  let filtered = tasks.filter((task) => task.userId === userId);

  if (status !== "all") {
    filtered = filtered.filter((task) => task.status === status);
  }

  if (normalizedSearch) {
    filtered = filtered.filter((task) => {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const safeLimit = Math.max(1, Number(limit) || 8);
  const safePage = Math.max(1, Number(page) || 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const start = (safePage - 1) * safeLimit;
  const completedCount = filtered.filter((task) => task.status === "completed").length;
  const pendingCount = total - completedCount;

  return {
    tasks: clone(filtered.slice(start, start + safeLimit)),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    completedCount,
    pendingCount
  };
}

export function findMemoryTaskById(id) {
  const task = tasks.find((item) => item._id === id);
  return task ? clone(task) : null;
}

export function updateMemoryTask(id, updates) {
  const index = tasks.findIndex((task) => task._id === id);
  if (index === -1) {
    return null;
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return clone(tasks[index]);
}

export function deleteMemoryTask(id) {
  const index = tasks.findIndex((task) => task._id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}
