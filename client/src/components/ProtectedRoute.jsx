import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, tokenReady } = useAuth();

  if (!tokenReady) {
    return (
      <div className="screen-center">
        <div className="loading-card">Loading your workspace...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

