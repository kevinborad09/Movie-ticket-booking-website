import { useNavigate } from "react-router-dom";

function HeroBanner({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const genres = movie.genre ? movie.genre.split(" • ") : [];

  return (
    <section className="hero" id="hero-banner">
      <div className="hero__bg">
        <img className="hero__bg-image" src={movie.poster} alt={`${movie.title} banner`} loading="eager" fetchPriority="high" />
        <div className="hero__overlay" />
      </div>

      <div className="container hero__content">
        <span className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          Now Showing
        </span>

        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__description">{movie.description}</p>

        <div className="hero__meta">
          <span className="hero__rating" aria-label={`Rating: ${movie.rating} out of 10`}>⭐ {movie.rating}</span>
          <span className="hero__meta-divider" aria-hidden="true" />
          <span className="hero__meta-item">{movie.year}</span>
          {genres.map((genre, i) => (
            <span key={i}>
              <span className="hero__meta-divider" aria-hidden="true" />
              <span className="hero__meta-item">{genre}</span>
            </span>
          ))}
          {movie.duration && (
            <>
              <span className="hero__meta-divider" aria-hidden="true" />
              <span className="hero__meta-item">{movie.duration}</span>
            </>
          )}
        </div>

        <div className="hero__buttons">
          <button className="btn btn--primary" onClick={() => navigate(`/booking/theatre/${movie.id}`)}>🎬 Book Tickets</button>
          <button className="btn btn--outline" onClick={() => navigate(`/movies/${movie.id}`)}>ℹ️ View Details</button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
