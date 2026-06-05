function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  if (!tasks.length) {
    return (
      <div className="card empty-state">
        <h3>No tasks found</h3>
        <p>Try a different filter or create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <article key={task._id} className={`task-card card ${task.status}`}>
          <div className="task-card-header">
            <div>
              <span className={`status-badge ${task.status}`}>{task.status}</span>
              <h3>{task.title}</h3>
            </div>
            <button className="ghost-button" onClick={() => onToggle(task)}>
              {task.status === "completed" ? "Mark pending" : "Mark done"}
            </button>
          </div>

          <p className="task-description">{task.description || "No description provided."}</p>

          <div className="task-meta">
            <span>{formatDate(task.createdAt)}</span>
            <span>{task.status === "completed" ? "Done" : "In progress"}</span>
          </div>

          <div className="task-actions">
            <button className="primary-button secondary" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="danger-button" onClick={() => onDelete(task)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
