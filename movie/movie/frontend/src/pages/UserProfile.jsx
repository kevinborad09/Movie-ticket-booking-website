import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function UserProfile() {
  const { user, authFetch, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const body = { name: form.name, phone: form.phone };

      const res = await authFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      updateUser(data.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <h1 className="page-title">My Profile</h1>

          <div className="profile-layout">
            <div className="profile-card">
              <div className="profile-card__avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <h2 className="profile-card__name">{user?.name}</h2>
              <p className="profile-card__email">{user?.email}</p>
              <p className="profile-card__role">{user?.role === "admin" ? "🛡️ Administrator" : "👤 Member"}</p>
              <p className="profile-card__joined">Joined {new Date(user?.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
            </div>

            <div className="profile-form-card">
              <h2 className="profile-form-card__title">Edit Profile</h2>

              {message.text && (
                <div className={`auth-${message.type === "success" ? "success" : "error"}`}>{message.text}</div>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" name="name" type="text" value={form.name} onChange={handleChange} required />
                </div>
                <div className="auth-field">
                  <label htmlFor="profile-email">Email</label>
                  <input id="profile-email" type="email" value={user?.email} disabled className="auth-input--disabled" />
                </div>
                <div className="auth-field">
                  <label htmlFor="profile-phone">Phone</label>
                  <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn--primary auth-submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UserProfile;
