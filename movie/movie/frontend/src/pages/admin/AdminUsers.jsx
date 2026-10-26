import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsers(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authFetch]);

  return (
    <div>
      <h1 className="admin-page-title">User Management</h1>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Bookings</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td><span className={`admin-status admin-status--${u.role}`}>{u.role}</span></td>
                  <td>{u.bookingCount}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
