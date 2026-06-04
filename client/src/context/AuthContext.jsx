import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("task_manager_token");
    const cachedUser = localStorage.getItem("task_manager_user");

    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
      api
        .get("/auth/me")
        .then((response) => {
          setUser(response.data.user);
          localStorage.setItem("task_manager_user", JSON.stringify(response.data.user));
        })
        .catch(() => {
          localStorage.removeItem("task_manager_token");
          localStorage.removeItem("task_manager_user");
          setUser(null);
        })
        .finally(() => setTokenReady(true));
      return;
    }

    setTokenReady(true);
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("task_manager_token", data.token);
    localStorage.setItem("task_manager_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("task_manager_token", data.token);
    localStorage.setItem("task_manager_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("task_manager_token");
    localStorage.removeItem("task_manager_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, tokenReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

