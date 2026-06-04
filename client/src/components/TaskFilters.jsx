export default function TaskFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="filters card">
      <label className="field filter-search">
        <span>Search</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or description"
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="all">All tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>
    </div>
  );
}

