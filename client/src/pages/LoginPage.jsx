import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel hero-panel">
        <p className="eyebrow">Task Manager</p>
        <h1>Keep every task clear, visible, and under control.</h1>
        <p>
          A focused MERN dashboard for logging in, managing tasks, and staying organized with
          search, filters, and fast CRUD operations.
        </p>
      </section>

      <section className="auth-panel form-panel card">
        <div className="card-title-row">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>Login</h2>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}

