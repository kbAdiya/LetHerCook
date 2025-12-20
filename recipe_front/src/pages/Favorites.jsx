import { useEffect, useState } from "react";
import { getFavorites } from "../services/favoriteService";
import RecipeCard from "../components/RecipeCard";
import { useTranslate } from "../i18n/useTranslate";
import "../styles/favorites.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();
 const { user } = useAuth();
 
  useEffect(() => {
     if (!user) return; 
    getFavorites()
      .then(data => {
       
        if (Array.isArray(data)) {
          setFavorites(data);
        } else if (data.results && Array.isArray(data.results)) {
          setFavorites(data.results);
        } else {
          setFavorites([]);
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки избранного:", err);
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  }, []);

    if (!user) {
    return <Navigate to="/" replace />;
  }
  const handleFavoriteChange = (recipeId, isFavorite) => {
    if (!isFavorite) {
      
      setFavorites(prevFavorites => 
        prevFavorites.filter(recipe => recipe.id !== recipeId)
      );
    }
  };

  if (loading) return <div>{t("loading")}</div>;

  return (

    <div className="favorites-container">
      <header className="favorites-header">
        <h1>{t("myFavorites")}</h1>
        <p className="favorites-count">
          {favorites.length} {t("recipesSaved")}
        </p>
      </header>

      {favorites.length > 0 ? (
        <div className="recipe-grid">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              initialIsFavorite={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <div className="empty-icon">🍳</div>
          <h3>{t("noFavorites")}</h3>
          <p>{t("startAddingRecipes")}</p>
          <button className="browse-btn" onClick={() => window.location.href = '/'}>
            {t("browseRecipes")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Favorites;