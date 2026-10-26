import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join CineBook and start booking movies</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} />
          </div>
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
