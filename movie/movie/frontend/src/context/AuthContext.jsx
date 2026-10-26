import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("cinebook_token"));
  const [loading, setLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data.success) setUser(data.data);
          else throw new Error();
        })
        .catch(() => {
          localStorage.removeItem("cinebook_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("cinebook_token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const signup = useCallback(async (name, email, password, phone) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("cinebook_token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cinebook_token");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = { ...options.headers };
      if (token) headers.Authorization = `Bearer ${token}`;
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
      }
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        logout();
        throw new Error("Session expired");
      }
      return res;
    },
    [token, logout]
  );

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, updateUser, authFetch, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
