import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TheatreSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theatreGroups, setTheatreGroups] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate next 3 dates (local time)
  useEffect(() => {
    const d = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      d.push(`${y}-${m}-${day}`);
    }
    setDates(d);
    setSelectedDate(d[0]);
  }, []);

  // Fetch movie info
  useEffect(() => {
    fetch(`/api/movies/${movieId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMovie(d.data); })
      .catch(() => {});
  }, [movieId]);

  // Fetch shows for selected date
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`/api/shows?movieId=${movieId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setTheatreGroups(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movieId, selectedDate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          {movie && (
            <div className="theatre-page__movie-header">
              <img src={movie.poster} alt={movie.title} className="theatre-page__movie-thumb" />
              <div>
                <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>{movie.title}</h1>
                <p className="theatre-page__movie-meta">{movie.genre} • {movie.duration} • {movie.language}</p>
              </div>
            </div>
          )}

          {/* Date Selector */}
          <div className="date-selector">
            {dates.map((d) => (
              <button key={d} className={`date-selector__btn ${d === selectedDate ? "date-selector__btn--active" : ""}`} onClick={() => setSelectedDate(d)}>
                {formatDate(d)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Finding shows...</p></div>
          ) : theatreGroups.length === 0 ? (
            <div className="error-container"><span className="error-icon">🎭</span><h3 className="error-title">No shows available</h3><p className="error-message">Try a different date</p></div>
          ) : (
            <div className="theatre-list">
              {theatreGroups.map((group) => (
                <div className="theatre-list__item" key={group.theatre.id}>
                  <div className="theatre-list__info">
                    <h3 className="theatre-list__name">{group.theatre.name}</h3>
                    <p className="theatre-list__address">📍 {group.theatre.address}</p>
                  </div>
                  <div className="theatre-list__shows">
                    {group.shows.map((show) => (
                      <button key={show.id} className="showtime-btn" onClick={() => navigate(`/booking/seats/${show.id}`)}>
                        <span className="showtime-btn__time">{show.time}</span>
                        <span className="showtime-btn__type">{show.screenType}</span>
                        <span className="showtime-btn__price">₹{show.price.regular}+</span>
                      </button>
                    ))}
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

export default TheatreSelection;
