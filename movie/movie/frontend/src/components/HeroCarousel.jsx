import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HeroCarousel({ movies }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState("next");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const items = movies?.slice(0, 5) || [];

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? "next" : "prev");
      setCurrent(index);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-advance
  useEffect(() => {
    if (isHovered || items.length <= 1) return;
    timeoutRef.current = setTimeout(goNext, 2000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, isHovered, goNext, items.length]);

  if (!items.length) return null;

  const movie = items[current];

  return (
    <section
      className="carousel"
      id="hero-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background slides */}
      {items.map((m, i) => (
        <div
          key={m.id}
          className={`carousel__slide ${i === current ? "carousel__slide--active" : ""}`}
        >
          <img
            src={m.poster}
            alt={m.title}
            className="carousel__slide-img"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="carousel__slide-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="container carousel__content" key={movie.id + direction}>
        <span className="carousel__badge">
          <span className="carousel__badge-dot" aria-hidden="true" />
          Now Showing
        </span>

        <h1 className="carousel__title">{movie.title}</h1>
        <p className="carousel__description">{movie.description}</p>

        <div className="carousel__meta">
          <span className="carousel__rating">⭐ {movie.rating}</span>
          <span className="carousel__meta-divider">•</span>
          <span>{movie.year}</span>
          <span className="carousel__meta-divider">•</span>
          <span>{movie.genre}</span>
          {movie.duration && (
            <>
              <span className="carousel__meta-divider">•</span>
              <span>{movie.duration}</span>
            </>
          )}
        </div>

        <div className="carousel__actions">
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/booking/theatre/${movie.id}`)}
          >
            🎬 Book Tickets
          </button>
          <button
            className="btn btn--outline"
            onClick={() => navigate(`/movies/${movie.id}`)}
          >
            ℹ️ View Details
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button className="carousel__arrow carousel__arrow--prev" onClick={goPrev} aria-label="Previous movie">
            ‹
          </button>
          <button className="carousel__arrow carousel__arrow--next" onClick={goNext} aria-label="Next movie">
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="carousel__dots">
          {items.map((m, i) => (
            <button
              key={m.id}
              className={`carousel__dot ${i === current ? "carousel__dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to ${m.title}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroCarousel;
