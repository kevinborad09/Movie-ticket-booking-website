import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <article className="movie-card" id={`movie-card-${movie.id}`}>
      <Link to={`/movies/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster-wrapper">
          <img className="movie-card__poster" src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
          <div className="movie-card__rating-badge" aria-label={`Rating: ${movie.rating}`}>⭐ {movie.rating}</div>
          <div className="movie-card__overlay">
            <span className="movie-card__book-btn">🎬 Book Tickets</span>
          </div>
        </div>
      </Link>
      <div className="movie-card__info">
        <Link to={`/movies/${movie.id}`}><h3 className="movie-card__title">{movie.title}</h3></Link>
        <p className="movie-card__genre">{movie.genre}</p>
        <p className="movie-card__desc">{movie.description}</p>
      </div>
    </article>
  );
}

export default MovieCard;
