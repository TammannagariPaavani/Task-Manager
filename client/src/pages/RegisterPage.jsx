import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel hero-panel">
        <p className="eyebrow">Task Manager</p>
        <h1>Start with a workspace that feels organized.</h1>
        <p>
          Register once, then create tasks, update priorities, and track completion from a
          responsive dashboard built for everyday use.
        </p>
        <div className="hero-preview" aria-hidden="true">
          <div className="preview-toolbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-list">
            <div className="preview-item active">
              <strong>Create account</strong>
              <small>Secure auth</small>
            </div>
            <div className="preview-item">
              <strong>Add tasks</strong>
              <small>CRUD ready</small>
            </div>
            <div className="preview-item accent">
              <strong>Track status</strong>
              <small>Pending or done</small>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-panel form-panel card">
        <div className="card-title-row">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Create account</h2>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
