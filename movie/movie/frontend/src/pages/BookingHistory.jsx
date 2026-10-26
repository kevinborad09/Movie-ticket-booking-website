import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BookingHistory() {
  const { authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    authFetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [authFetch]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await authFetch(`/api/bookings/${id}/cancel`, { method: "PUT" });
      const data = await res.json();
      if (data.success) fetchBookings();
    } catch {}
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <h1 className="page-title">My Bookings</h1>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading bookings...</p></div>
          ) : bookings.length === 0 ? (
            <div className="error-container">
              <span className="error-icon">🎫</span>
              <h3 className="error-title">No bookings yet</h3>
              <p className="error-message">Book your first movie ticket now!</p>
              <Link to="/movies" className="btn btn--primary" style={{ marginTop: "1rem" }}>Browse Movies</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((b) => (
                <div className={`booking-card ${b.status === "cancelled" ? "booking-card--cancelled" : ""}`} key={b.id}>
                  <img src={b.moviePoster} alt={b.movieTitle} className="booking-card__poster" />
                  <div className="booking-card__info">
                    <div className="booking-card__header">
                      <h3 className="booking-card__movie">{b.movieTitle}</h3>
                      <span className={`booking-card__status booking-card__status--${b.status}`}>
                        {b.status === "confirmed" ? "✅ Confirmed" : "❌ Cancelled"}
                      </span>
                    </div>
                    <p className="booking-card__detail">{b.theatreName} • {b.screenName}</p>
                    <p className="booking-card__detail">📅 {b.date} • ⏰ {b.time}</p>
                    <p className="booking-card__detail">💺 Seats: {b.seats.join(", ")}</p>
                    <div className="booking-card__footer">
                      <span className="booking-card__amount">₹{b.grandTotal?.toLocaleString("en-IN")}</span>
                      <span className="booking-card__id">#{b.id}</span>
                      {b.status === "confirmed" && (
                        <button className="booking-card__cancel-btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BookingHistory;
