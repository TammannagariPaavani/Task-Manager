import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  status: "pending"
};

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending"
      });
      return;
    }
    setFormData(initialForm);
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (formData.title.trim().length < 3) {
      nextErrors.title = "Title should be at least 3 characters.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status
      });
      if (!editingTask) {
        setFormData(initialForm);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form card" onSubmit={handleSubmit}>
      <div className="card-title-row">
        <div>
          <p className="eyebrow">{editingTask ? "Update task" : "New task"}</p>
          <h2>{editingTask ? "Edit task details" : "Add a task"}</h2>
        </div>
        {editingTask ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <label className="field">
        <span>Title</span>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Prepare internship demo"
        />
        {errors.title ? <small className="field-error">{errors.title}</small> : null}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add short notes or context"
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? "Saving..." : editingTask ? "Save changes" : "Add task"}
      </button>
    </form>
  );
}
