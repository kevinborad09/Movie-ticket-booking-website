import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function BookingConfirmation() {
  const { bookingId } = useParams();
  const { authFetch } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setBooking(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId, authFetch]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading booking...</p></div></div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="error-container"><span className="error-icon">🎫</span><h3 className="error-title">Booking not found</h3><Link to="/" className="btn btn--primary">Go Home</Link></div></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container confirmation-page">
          <div className="confirmation-card">
            <div className="confirmation-card__icon">✅</div>
            <h1 className="confirmation-card__title">Booking Confirmed!</h1>
            <p className="confirmation-card__subtitle">Your tickets have been booked successfully</p>

            <div className="confirmation-card__ticket">
              <div className="confirmation-card__ticket-header">
                <img src={booking.moviePoster} alt={booking.movieTitle} className="confirmation-card__poster" />
                <div>
                  <h2 className="confirmation-card__movie">{booking.movieTitle}</h2>
                  <p>{booking.theatreName}</p>
                  <p>{booking.screenName} ({booking.screenType})</p>
                </div>
              </div>

              <div className="confirmation-card__details">
                <div className="confirmation-card__detail">
                  <span className="confirmation-card__label">Booking ID</span>
                  <span className="confirmation-card__value">{booking.id}</span>
                </div>
                <div className="confirmation-card__detail">
                  <span className="confirmation-card__label">Date</span>
                  <span className="confirmation-card__value">{booking.date}</span>
                </div>
                <div className="confirmation-card__detail">
                  <span className="confirmation-card__label">Time</span>
                  <span className="confirmation-card__value">{booking.time}</span>
                </div>
                <div className="confirmation-card__detail">
                  <span className="confirmation-card__label">Seats</span>
                  <span className="confirmation-card__value">{booking.seats.join(", ")}</span>
                </div>
                <div className="confirmation-card__detail">
                  <span className="confirmation-card__label">Amount Paid</span>
                  <span className="confirmation-card__value confirmation-card__amount">₹{booking.grandTotal?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-card__actions">
              <Link to="/bookings" className="btn btn--primary">View My Bookings</Link>
              <Link to="/" className="btn btn--outline">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BookingConfirmation;
