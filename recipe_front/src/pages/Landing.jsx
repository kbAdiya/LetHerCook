import { Navigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import RecipeSearch from "../components/RecipeSearch";
import { useTranslate } from "../i18n/useTranslate";
import "../styles/laning.css"
import { Link } from "react-router-dom";
function Landing() {
  const { user } = useAuth();
  const { t } = useTranslate();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
    <div className="home-container">
      <div className="overlay">
      <h1 className="welcome-text">{t("landingTitle")}</h1>
       
      <p className="home-description"><Link to="/register" className="signup-link">{t("landingSubtitle")}</Link></p>
      
      
      </div>
    </div>
      <RecipeSearch />
    </>
  );
}

export default Landing;