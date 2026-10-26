import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminMovies() {
  const { authFetch } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", genre: "", rating: "", year: "", duration: "", description: "" });

  const fetchMovies = () => {
    setLoading(true);
    fetch("/api/movies")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMovies(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("/api/admin/movies", {
        method: "POST",
        body: JSON.stringify({ ...form, rating: parseFloat(form.rating) || 0, year: parseInt(form.year) || new Date().getFullYear() }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ title: "", genre: "", rating: "", year: "", duration: "", description: "" });
        fetchMovies();
      }
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await authFetch(`/api/admin/movies/${id}`, { method: "DELETE" });
      fetchMovies();
    } catch {}
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Movies Management</h1>
        <button className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Movie"}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <div className="admin-form__grid">
            <input type="text" placeholder="Movie Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input type="text" placeholder="Genre (e.g. Action • Thriller)" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
            <input type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            <input type="text" placeholder="Duration (e.g. 2h 15m)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="btn btn--primary">Save Movie</button>
        </form>
      )}

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><img src={m.poster} alt={m.title} className="admin-table__thumb" /></td>
                  <td><strong>{m.title}</strong></td>
                  <td>{m.genre}</td>
                  <td>⭐ {m.rating}</td>
                  <td>{m.year}</td>
                  <td>
                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDelete(m.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminMovies;
