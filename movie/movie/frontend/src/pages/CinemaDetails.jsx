import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CinemaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theatre, setTheatre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get local YYYY-MM-DD
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Generate next 3 days for date filter
  const dates = [];
  for (let d = 0; d < 3; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    dates.push({
      value: toLocalDateStr(date),
      label: d === 0 ? "Today" : d === 1 ? "Tomorrow" : date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    });
  }

  // Initialize selectedDate directly to avoid timing issues
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return toLocalDateStr(now);
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/theatres/${id}/movies`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setTheatre(d.theatre);
          setMovies(d.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Filter movies to only show those with shows on the selected date
  const filteredMovies = movies
    .map((movie) => ({
      ...movie,
      shows: movie.shows.filter((s) => s.date === (selectedDate || dates[0]?.value)),
    }))
    .filter((movie) => movie.shows.length > 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading cinema details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!theatre) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper">
          <div className="error-container">
            <span className="error-icon">🎬</span>
            <h3 className="error-title">Cinema not found</h3>
            <Link to="/cinemas" className="btn btn--primary">Browse Cinemas</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        {/* Cinema Hero Banner */}
        <div className="cinema-hero">
          <img src={theatre.image} alt={theatre.name} className="cinema-hero__bg" />
          <div className="cinema-hero__overlay" />
          <div className="container cinema-hero__content">
            <Link to="/cinemas" className="cinema-hero__back">
              ← Back to Cinemas
            </Link>
            <h1 className="cinema-hero__name">{theatre.name}</h1>
            <p className="cinema-hero__address">📍 {theatre.address}</p>
            <div className="cinema-hero__meta">
              <span className="cinema-hero__screens">{theatre.screenCount} Screens</span>
              <div className="cinema-hero__types">
                {theatre.screenTypes.map((type, i) => (
                  <span key={i} className="cinema-hero__type-badge">{type}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Date Selector */}
          <div className="cinema-dates">
            <h2 className="cinema-dates__title">Now Showing</h2>
            <div className="cinema-dates__pills">
              {dates.map((d) => (
                <button
                  key={d.value}
                  className={`cinema-dates__pill ${selectedDate === d.value ? "cinema-dates__pill--active" : ""}`}
                  onClick={() => setSelectedDate(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Movies List */}
          {filteredMovies.length === 0 ? (
            <div className="cinema-empty">
              <span className="cinema-empty__icon">🎞️</span>
              <h3 className="cinema-empty__title">No shows available</h3>
              <p className="cinema-empty__text">There are no movies scheduled for this date at this cinema.</p>
            </div>
          ) : (
            <div className="cinema-movies">
              {filteredMovies.map((movie) => (
                <article key={movie.id} className="cinema-movie-card">
                  <div className="cinema-movie-card__poster-col">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="cinema-movie-card__poster"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    />
                  </div>
                  <div className="cinema-movie-card__info-col">
                    <div className="cinema-movie-card__header">
                      <h3
                        className="cinema-movie-card__title"
                        onClick={() => navigate(`/movies/${movie.id}`)}
                      >
                        {movie.title}
                      </h3>
                      <div className="cinema-movie-card__meta">
                        <span className="cinema-movie-card__rating">⭐ {movie.rating}</span>
                        <span className="cinema-movie-card__dot">•</span>
                        <span>{movie.duration}</span>
                        <span className="cinema-movie-card__dot">•</span>
                        <span>{movie.language}</span>
                      </div>
                      <div className="cinema-movie-card__genres">
                        {movie.genre.split(" • ").map((g, i) => (
                          <span key={i} className="cinema-movie-card__genre-tag">{g}</span>
                        ))}
                      </div>
                    </div>

                    {/* Group shows by screen */}
                    <div className="cinema-movie-card__shows">
                      {Object.values(
                        movie.shows.reduce((acc, show) => {
                          const key = `${show.screenName}-${show.screenType}`;
                          if (!acc[key]) {
                            acc[key] = {
                              screenName: show.screenName,
                              screenType: show.screenType,
                              times: [],
                            };
                          }
                          acc[key].times.push({ id: show.id, time: show.time, price: show.price });
                          return acc;
                        }, {})
                      ).map((screen, si) => (
                        <div key={si} className="cinema-movie-card__screen">
                          <div className="cinema-movie-card__screen-label">
                            <span className="cinema-movie-card__screen-name">{screen.screenName}</span>
                            <span className="cinema-movie-card__screen-type">{screen.screenType}</span>
                          </div>
                          <div className="cinema-movie-card__times">
                            {screen.times.map((t) => (
                              <button
                                key={t.id}
                                className="cinema-movie-card__time-btn"
                                onClick={() => navigate(`/booking/seats/${t.id}`)}
                              >
                                {t.time}
                                <span className="cinema-movie-card__price">₹{t.price.regular}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn--primary cinema-movie-card__book-btn"
                      onClick={() => navigate(`/booking/theatre/${movie.id}`)}
                    >
                      🎬 Book Tickets
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CinemaDetails;
