import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authFetch]);

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading dashboard...</p></div>;
  }

  const cards = [
    { label: "Total Movies", value: stats?.totalMovies || 0, icon: "🎬", color: "#e50914" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👥", color: "#2196f3" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: "🎫", color: "#4caf50" },
    { label: "Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: "💰", color: "#ffc107" },
    { label: "Confirmed", value: stats?.confirmedBookings || 0, icon: "✅", color: "#00bcd4" },
    { label: "Cancelled", value: stats?.cancelledBookings || 0, icon: "❌", color: "#ff5722" },
    { label: "Theatres", value: stats?.totalTheatres || 0, icon: "🏛️", color: "#9c27b0" },
    { label: "Total Shows", value: stats?.totalShows || 0, icon: "📅", color: "#607d8b" },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div className="admin-stat-card" key={c.label} style={{ borderTopColor: c.color }}>
            <span className="admin-stat-card__icon">{c.icon}</span>
            <span className="admin-stat-card__value">{c.value}</span>
            <span className="admin-stat-card__label">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
