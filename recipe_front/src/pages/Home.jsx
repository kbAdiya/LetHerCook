
import { Navigate } from "react-router-dom"; 
import RecipeSearch from "../components/RecipeSearch";
import { useAuth } from "../context/AuthContext";
import { useTranslate } from "../i18n/useTranslate";
import "../styles/hom.css"

function Home() {
  const { user } = useAuth();
  const { t } = useTranslate();


  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
    <div className="home-container">
      <div className="overlay">
        <h1 className="welcome-text">
          {t("welcome")} {user.username}!
        </h1>
        <p className="home-description">
          {t("homeDescription")}
        </p>
        
      </div>
      </div>
      <RecipeSearch />
    </div>
  );
}

export default Home;