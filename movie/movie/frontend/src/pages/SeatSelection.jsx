import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showData, setShowData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shows/${showId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setShowData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [showId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading seats...</p></div></div>
      </>
    );
  }

  if (!showData) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="error-container"><span className="error-icon">💺</span><h3 className="error-title">Show not found</h3></div></div>
      </>
    );
  }

  const { screen, bookedSeats, price, movie, theatre } = showData;
  const rows = Object.entries(screen.rows);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : prev.length < 10 ? [...prev, seatId] : prev
    );
  };

  const getSeatType = (row) => screen.rows[row] || "regular";

  const totalAmount = selectedSeats.reduce((sum, seatId) => {
    const row = seatId.charAt(0);
    const type = getSeatType(row);
    return sum + (price[type] || price.regular);
  }, 0);

  const handleProceed = () => {
    if (!user) {
      navigate("/login", { state: { from: `/booking/seats/${showId}` } });
      return;
    }
    if (selectedSeats.length === 0) return;
    // Store booking info in sessionStorage for the payment page
    sessionStorage.setItem("cinebook_pending", JSON.stringify({ showId: showData.id, seats: selectedSeats, totalAmount, showData }));
    navigate("/booking/payment");
  };

  const typeColors = { vip: "#ffc107", premium: "#00bcd4", regular: "#4caf50" };

  return (
    <>
      <Navbar />
      <main className="seat-page">
        <div className="container">
          {/* Show Info */}
          <div className="seat-page__header">
            <h1 className="seat-page__movie-title">{movie.title}</h1>
            <p className="seat-page__show-info">{theatre.name} • {screen.name} ({screen.type}) • {showData.date} • {showData.time}</p>
          </div>

          {/* Screen indicator */}
          <div className="seat-map">
            <div className="seat-map__screen">
              <div className="seat-map__screen-shape" />
              <span className="seat-map__screen-label">SCREEN</span>
            </div>

            {/* Seat Grid */}
            <div className="seat-map__grid">
              {rows.map(([row, type]) => (
                <div className="seat-map__row" key={row}>
                  <span className="seat-map__row-label">{row}</span>
                  <div className="seat-map__seats">
                    {Array.from({ length: screen.seatsPerRow }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      let className = "seat";
                      if (isBooked) className += " seat--booked";
                      else if (isSelected) className += " seat--selected";
                      else className += ` seat--${type}`;

                      return (
                        <button key={seatId} className={className} onClick={() => toggleSeat(seatId)} disabled={isBooked} title={`${seatId} — ${type.toUpperCase()} ₹${price[type]}`}>
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <span className="seat-map__row-type" style={{ color: typeColors[type] }}>{type.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="seat-map__legend">
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--regular" /> Available</div>
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--selected" /> Selected</div>
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--booked" /> Booked</div>
              <div className="seat-map__legend-divider" />
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--vip" /> VIP ₹{price.vip}</div>
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--premium" /> Premium ₹{price.premium}</div>
              <div className="seat-map__legend-item"><span className="seat seat--legend seat--regular" /> Regular ₹{price.regular}</div>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSeats.length > 0 && (
            <div className="seat-page__summary">
              <div className="seat-page__summary-info">
                <p className="seat-page__summary-seats">
                  <strong>{selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""}:</strong>{" "}
                  {selectedSeats.sort().join(", ")}
                </p>
                <p className="seat-page__summary-total">Total: <strong>₹{totalAmount.toLocaleString("en-IN")}</strong></p>
              </div>
              <button className="btn btn--primary btn--lg" onClick={handleProceed}>
                Proceed to Payment →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default SeatSelection;
