import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMovies(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Sync URL param to search state
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase()) ||
      (m.director && m.director.toLowerCase().includes(search.toLowerCase())) ||
      (m.language && m.language.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">All Movies</h1>
            <div className="page-search">
              <input
                type="text"
                placeholder="Search by title, genre, director..."
                value={search}
                onChange={handleSearchChange}
                className="page-search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p className="loading-text">Loading movies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="error-container">
              <span className="error-icon">🔍</span>
              <h3 className="error-title">No movies found</h3>
              <p className="error-message">Try a different search term</p>
              {search && (
                <button className="btn btn--outline" style={{ marginTop: "1rem" }} onClick={() => { setSearch(""); setSearchParams({}); }}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="movies-grid">
              {filtered.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Movies;
