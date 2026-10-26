import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__logo">
            Cine<span className="admin-sidebar__logo-accent">Book</span>
          </span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/movies" className={({ isActive }) => `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}>
            🎬 Movies
          </NavLink>
          <NavLink to="/admin/bookings" className={({ isActive }) => `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}>
            🎫 Bookings
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}>
            👥 Users
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__avatar">{user?.name?.charAt(0)}</span>
            <span className="admin-sidebar__username">{user?.name}</span>
          </div>
          <NavLink to="/" className="admin-sidebar__link">🏠 Back to Site</NavLink>
          <button className="admin-sidebar__link admin-sidebar__logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
