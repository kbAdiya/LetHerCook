import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import heartIcon from "./assets/icons/heart.svg";
import profileIcon from "./assets/icons/profile.svg";
import "./styles/navbar.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/#categories" },
  { label: "All recipes", to: "/#recipes" },
  { label: "About us", to: "/about" },
];

function Navbar({ isAuthenticated, username, onLogout, onFavorites }) {
  return (
    <header className="navbar-wrapper">
  <div className="navbar-top-line"></div> {/* желтая линия сверху */}
  <nav className="navbar">
    {/* контейнер для центрирования содержимого */}
    <div className="navbar-container">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="LetHerCook logo" className="navbar-logo" />
        <span className="navbar-brand-title">LetHerCook</span>
      </Link>

      <ul className="navbar-menu">
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} className="navbar-menu-link">{label}</Link>
          </li>
        ))}
      </ul>

      <div className="navbar-actions">
        <button type="button" className="navbar-icon-button" aria-label="Open favourites" onClick={() => onFavorites?.()}>
          <img src={heartIcon} alt="" />
        </button>

        {isAuthenticated ? (
          <>
            <div className="navbar-profile-pill" title={username || "Profile"}>
              <img src={profileIcon} alt="" />
              <span>{username || "Profile"}</span>
            </div>
            <button type="button" className="navbar-logout" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <div className="navbar-auth-links">
            <Link to="/login" className="navbar-login">Login</Link>
            <Link to="/register" className="navbar-signup">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  </nav>
</header>
  );
}

export default Navbar;

