import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeMobile();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/movies?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      closeMobile();
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} id="main-navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMobile}>
          <span className="navbar__logo-icon" aria-hidden="true">▶</span>
          <span>Cine<span className="navbar__logo-accent">Book</span></span>
        </Link>

        <ul className="navbar__links">
          <li><Link to="/" className="navbar__link">Home</Link></li>
          <li><Link to="/movies" className="navbar__link">Movies</Link></li>
          <li><Link to="/cinemas" className="navbar__link">Cinemas</Link></li>
        </ul>

        <div className="navbar__actions">
          <form className="navbar__search" id="search-bar" onSubmit={handleSearch}>
            <span className="navbar__search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Search movies..."
              aria-label="Search movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {user ? (
            <div className="navbar__user-menu" ref={userMenuRef}>
              <button className="navbar__user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <span className="navbar__user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="navbar__user-name">{user.name.split(" ")[0]}</span>
                <span aria-hidden="true">▾</span>
              </button>

              {userMenuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user.name}</span>
                    <span className="navbar__dropdown-email">{user.email}</span>
                  </div>
                  <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>👤 My Profile</Link>
                  <Link to="/bookings" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>🎫 My Bookings</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>🛡️ Admin Panel</Link>
                  )}
                  <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__login-btn">Sign In</Link>
          )}
        </div>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${mobileOpen ? "navbar__hamburger--open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu" aria-expanded={mobileOpen}>
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileOpen ? "navbar__mobile-menu--open" : ""}`}>
        {/* Mobile Search */}
        <form className="navbar__mobile-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar__mobile-search-input"
          />
          <button type="submit" className="navbar__mobile-search-btn">🔍</button>
        </form>

        <Link to="/" className="navbar__mobile-link" onClick={closeMobile}>Home</Link>
        <Link to="/movies" className="navbar__mobile-link" onClick={closeMobile}>Movies</Link>
        <Link to="/cinemas" className="navbar__mobile-link" onClick={closeMobile}>Cinemas</Link>

        <div className="navbar__mobile-actions">
          {user ? (
            <>
              <Link to="/profile" className="navbar__mobile-link" onClick={closeMobile}>👤 Profile</Link>
              <Link to="/bookings" className="navbar__mobile-link" onClick={closeMobile}>🎫 Bookings</Link>
              {user.role === "admin" && <Link to="/admin" className="navbar__mobile-link" onClick={closeMobile}>🛡️ Admin</Link>}
              <button className="navbar__login-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__login-btn" onClick={closeMobile}>Sign In</Link>
              <Link to="/signup" className="navbar__mobile-link" onClick={closeMobile}>Create Account</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
