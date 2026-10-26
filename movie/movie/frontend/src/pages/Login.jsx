import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          Cine<span className="auth-logo-accent">Book</span>
        </Link>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to book your favourite movies</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <div className="auth-demo">
          <p className="auth-demo-title">Demo Accounts</p>
          <div className="auth-demo-accounts">
            <button className="auth-demo-btn" onClick={() => { setEmail("john@example.com"); setPassword("user123"); }}>
              👤 User: john@example.com / user123
            </button>
            <button className="auth-demo-btn" onClick={() => { setEmail("admin@cinebook.com"); setPassword("admin123"); }}>
              🛡️ Admin: admin@cinebook.com / admin123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
