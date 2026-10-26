import MovieCard from "./MovieCard";

function MovieSection({ movies, loading, error, onRetry }) {
  return (
    <section className="movies-section" id="latest-movies">
      <div className="container">
        <h2 className="section-title">Latest Movies</h2>

        {/* Loading State */}
        {loading && (
          <div className="loading-container" id="movies-loading">
            <div className="loading-spinner" aria-hidden="true" />
            <p className="loading-text">Loading movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-container" id="movies-error">
            <span className="error-icon" aria-hidden="true">
              🎞️
            </span>
            <h3 className="error-title">Unable to Load Movies</h3>
            <p className="error-message">
              We couldn&apos;t fetch the latest movies right now. Please check
              your connection and try again.
            </p>
            {onRetry && (
              <button
                className="error-retry-btn"
                onClick={onRetry}
                id="retry-btn"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="error-container" id="movies-empty">
            <span className="error-icon" aria-hidden="true">
              🍿
            </span>
            <h3 className="error-title">No Movies Available</h3>
            <p className="error-message">
              Check back soon — new movies are added regularly.
            </p>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && movies.length > 0 && (
          <div className="movies-grid" id="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MovieSection;
