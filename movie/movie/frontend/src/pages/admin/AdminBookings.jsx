import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminBookings() {
  const { authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authFetch]);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <h1 className="admin-page-title">Bookings Management</h1>

      <div className="admin-filters">
        {["all", "confirmed", "cancelled"].map((f) => (
          <button key={f} className={`admin-filter-btn ${filter === f ? "admin-filter-btn--active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? bookings.length : bookings.filter((b) => b.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">No bookings found</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Movie</th>
                <th>Theatre</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.id}</strong></td>
                  <td>{b.userName}<br /><small>{b.userEmail}</small></td>
                  <td>{b.movieTitle}</td>
                  <td>{b.theatreName}<br /><small>{b.screenName}</small></td>
                  <td>{b.date}<br /><small>{b.time}</small></td>
                  <td>{b.seats.join(", ")}</td>
                  <td>₹{b.grandTotal?.toLocaleString("en-IN")}</td>
                  <td><span className={`admin-status admin-status--${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
