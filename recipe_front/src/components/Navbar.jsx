
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import heartIcon from "../assets/icons/heart.svg";
import profileIcon from "../assets/icons/profile.svg";
import "../styles/navbar.css";
import { useLanguage } from "../context/LanguageContext";
import { useTranslate } from "../i18n/useTranslate";


function Navbar() {
  const { user, handleLogout } = useAuth();
  
  const isAuthenticated = !!user;
  const username = user?.username;

  const { lang, setLang } = useLanguage();
  const { t } = useTranslate();

  return (
 
    <header className="navbar-wrapper">
      <div className="navbar-top-line"></div>
      <nav className="navbar">
        <div className="navbar-container">
          
          <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
            <img src={logo} alt="LetHerCook logo" className="navbar-logo" />
            <span className="brand-name">LetHerCook</span>
          </Link>

          <ul className="navbar-menu">
            <li><Link to={isAuthenticated ? "/home" : "/"} className="navbar-menu-link">{t("home")}</Link></li>
            <li><Link to="/about" className="navbar-menu-link">{t("about")}</Link></li>
            <li><Link to="/categories" className="navbar-menu-link">{t("categories")}</Link></li>
            <li><Link to="/contactus" className="navbar-menu-link">{t("contact")}</Link></li>
          </ul>

          <div className="navbar-actions">

            {/* Language switcher */}
            <div className="navbar-language">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="navbar-language-select"
              >
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="kz">KZ</option>
              </select>
            </div>

            {isAuthenticated && (
              <Link to="/favorites" className="navbar-icon-button">
                <img src={heartIcon} alt="Favorites" style={{ width: '24px' }} />
              </Link>
            )}

            {isAuthenticated ? (
              <div className="user-section">
                <Link to="/profile" className="navbar-profile-pill">
                  <img src={profileIcon} alt="Profile" style={{ width: '30px' }} />
                  <span>{username}</span>
                </Link>
                <button className="navbar-logout" onClick={handleLogout}>
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/login" className="navbar-login">{t("login")}</Link>
                <Link to="/register" className="navbar-signup">{t("signup")}</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
     
  );
}

export default Navbar;