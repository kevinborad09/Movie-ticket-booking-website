import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMovie(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading movie...</p></div></div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper"><div className="error-container"><span className="error-icon">🎬</span><h3 className="error-title">Movie not found</h3><Link to="/movies" className="btn btn--primary">Browse Movies</Link></div></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="movie-details">
        {/* Hero backdrop */}
        <div className="movie-details__backdrop">
          <img src={movie.poster} alt={movie.title} className="movie-details__backdrop-img" />
          <div className="movie-details__backdrop-overlay" />
        </div>

        <div className="container movie-details__content">
          <div className="movie-details__poster-col">
            <img src={movie.poster} alt={movie.title} className="movie-details__poster" />
          </div>

          <div className="movie-details__info-col">
            <h1 className="movie-details__title">{movie.title}</h1>

            <div className="movie-details__meta">
              <span className="movie-details__rating">⭐ {movie.rating}/10</span>
              <span className="movie-details__meta-dot">•</span>
              <span>{movie.year}</span>
              <span className="movie-details__meta-dot">•</span>
              <span>{movie.duration}</span>
              <span className="movie-details__meta-dot">•</span>
              <span>{movie.language}</span>
            </div>

            <div className="movie-details__genres">
              {movie.genre.split(" • ").map((g, i) => (
                <span key={i} className="movie-details__genre-tag">{g}</span>
              ))}
            </div>

            <p className="movie-details__description">{movie.description}</p>

            {movie.director && (
              <div className="movie-details__crew">
                <h3>Director</h3>
                <p>{movie.director}</p>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className="movie-details__crew">
                <h3>Cast</h3>
                <div className="movie-details__cast-list">
                  {movie.cast.map((actor, i) => (
                    <span key={i} className="movie-details__cast-chip">{actor}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="movie-details__actions">
              <button className="btn btn--primary btn--lg" onClick={() => navigate(`/booking/theatre/${movie.id}`)}>
                🎬 Book Tickets
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MovieDetails;
