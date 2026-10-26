import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-name">
              Cine<span className="footer__brand-accent">Book</span>
            </div>
            <p className="footer__brand-desc">
              Your premium destination for movie ticket booking. Discover the
              latest films, find showtimes, and reserve the best seats — all
              in one place.
            </p>
            <div className="footer__socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Facebook"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Twitter / X"
                title="Twitter / X"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
                title="Instagram"
              >
                IG
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="YouTube"
                title="YouTube"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__column">
            <h4 className="footer__column-title">Quick Links</h4>
            <ul className="footer__column-links">
              <li>
                <Link to="/" className="footer__link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="footer__link">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/cinemas" className="footer__link">
                  Cinemas
                </Link>
              </li>
              <li>
                <Link to="/movies" className="footer__link">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="footer__link">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__column">
            <h4 className="footer__column-title">Company</h4>
            <ul className="footer__column-links">
              <li>
                <Link to="/" className="footer__link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer__column">
            <h4 className="footer__column-title">Support</h4>
            <ul className="footer__column-links">
              <li>
                <Link to="/" className="footer__link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} CineBook. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <Link to="/" className="footer__bottom-link">
              Terms of Service
            </Link>
            <Link to="/" className="footer__bottom-link">
              Privacy Policy
            </Link>
            <Link to="/" className="footer__bottom-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

