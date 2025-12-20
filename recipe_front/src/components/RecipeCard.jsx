
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { useFavorite } from "../hooks/useFavorite";
import "../styles/recipecard.css";
import { useTranslate } from "../i18n/useTranslate";


function RecipeCard({ recipe, initialIsFavorite = false, onFavoriteChange = null }) {
  const { t } = useTranslate();

  const { user } = useAuth(); 
  
  
  const { isFavorite, toggleFavorite, loading } = useFavorite(recipe.id, initialIsFavorite, onFavoriteChange);

  return (
    <div className="recipeCard">
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <img
      className="recipeCardMedia"
      src={recipe.photo}
      alt={recipe.name}
      loading="lazy"
    />
    
  </div>

  <div className="recipeCardBody">
    
    <div className="recipeCardHeader">
      <h3 className="recipeCardTitle">{recipe.name}</h3>
      {user && (
        <button
          className={`favoriteBtn ${isFavorite ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {loading
            ? t("loading")
            : isFavorite
              ? <span className="heart">♥</span>
              : <span className="heart">♡</span>
          }
        </button>
      )}
    </div>
    
    <p className="recipeCardDesc">{recipe.description || t("noDescription")}</p>
    <Link to={`/recipes/${recipe.id}`} className="detailsBtn">
       {t("details")}
    </Link>
  </div>
</div>

  );
}

export default RecipeCard;