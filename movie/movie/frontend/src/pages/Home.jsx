import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import MovieSection from "../components/MovieSection";
import Footer from "../components/Footer";
import fallbackMovies from "../data/movies";

const API_URL = "/api/movies";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setMovies(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("API fetch failed, using fallback data:", err.message);
      setMovies(fallbackMovies);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel movies={movies} />
        <MovieSection
          movies={movies}
          loading={loading}
          error={error}
          onRetry={fetchMovies}
        />
      </main>
      <Footer />
    </>
  );
}

export default Home;
