import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Pagination from "../components/Pagination.jsx";
import TaskFilters from "../components/TaskFilters.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    total: 0,
    completedCount: 0,
    pendingCount: 0
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/tasks", {
          params: { search, status, page, limit: PAGE_SIZE },
          signal: controller.signal
        });
        setTasks(data.tasks);
        setPagination({
          totalPages: data.totalPages,
          total: data.total,
          completedCount: data.completedCount ?? 0,
          pendingCount: data.pendingCount ?? 0
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || "Unable to load tasks.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTasks();
    return () => controller.abort();
  }, [page, search, status]);

  const refreshTasks = async () => {
    const { data } = await api.get("/tasks", {
      params: { search, status, page, limit: PAGE_SIZE }
    });
    setTasks(data.tasks);
    setPagination({
      totalPages: data.totalPages,
      total: data.total,
      completedCount: data.completedCount ?? 0,
      pendingCount: data.pendingCount ?? 0
    });
  };

  const handleCreateOrUpdate = async (payload) => {
    if (editingTask) {
      await api.put(`/tasks/${editingTask._id}`, payload);
      setEditingTask(null);
    } else {
      await api.post("/tasks", payload);
    }

    await refreshTasks();
  };

  const handleDelete = async (task) => {
    const shouldDelete = window.confirm(`Delete "${task.title}"?`);
    if (!shouldDelete) {
      return;
    }

    await api.delete(`/tasks/${task._id}`);
    await refreshTasks();
  };

  const handleToggle = async (task) => {
    await api.patch(`/tasks/${task._id}/toggle`);
    await refreshTasks();
  };

  const displayName = user?.name || "there";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <p className="eyebrow">Task manager</p>
          <h1>Welcome back, {displayName}</h1>
          <p>Plan, track, and complete your daily work from one focused dashboard.</p>
        </div>

        <div className="profile-panel">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="ghost-button compact" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card total">
          <span>Total tasks</span>
          <strong>{pagination.total}</strong>
        </article>
        <article className="stat-card completed">
          <span>Completed</span>
          <strong>{pagination.completedCount}</strong>
        </article>
        <article className="stat-card pending">
          <span>Pending</span>
          <strong>{pagination.pendingCount}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-column">
          <TaskForm
            onSubmit={handleCreateOrUpdate}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
          />
          <TaskFilters
            search={search}
            status={status}
            onSearchChange={(value) => {
              setPage(1);
              setSearch(value);
            }}
            onStatusChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
          />
        </div>

        <div className="dashboard-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your tasks</p>
              <h2>Latest work items</h2>
            </div>
            <span className="task-count">{pagination.total} total</span>
          </div>

          {error ? <div className="error-card">{error}</div> : null}
          {loading ? <div className="loading-card">Loading tasks...</div> : null}
          {!loading ? (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ) : null}
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      </section>
    </main>
  );
}
