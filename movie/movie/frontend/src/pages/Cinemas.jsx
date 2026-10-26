import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cinemas() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/theatres")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTheatres(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <h1 className="page-title">Our Cinemas</h1>
          <p className="page-subtitle">Select a cinema to see what's currently playing</p>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p className="loading-text">Loading cinemas...</p></div>
          ) : (
            <div className="cinemas-grid">
              {theatres.map((t) => (
                <Link to={`/cinemas/${t.id}`} className="cinema-card" key={t.id}>
                  <div className="cinema-card__image-wrapper">
                    <img src={t.image} alt={t.name} className="cinema-card__image" />
                    <div className="cinema-card__overlay">
                      <span className="cinema-card__screen-count">{t.screenCount} Screens</span>
                    </div>
                  </div>
                  <div className="cinema-card__info">
                    <h3 className="cinema-card__name">{t.name}</h3>
                    <p className="cinema-card__address">📍 {t.address}</p>
                    <div className="cinema-card__types">
                      {t.screenTypes.map((type, i) => (
                        <span key={i} className="cinema-card__type-badge">{type}</span>
                      ))}
                    </div>
                    <span className="cinema-card__cta">View Now Showing →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cinemas;
