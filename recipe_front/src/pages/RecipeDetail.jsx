
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import "../styles/recipedetail.css"
import { useTranslate } from "../i18n/useTranslate";
import { useLanguage } from "../context/LanguageContext";
import { translateQuantity } from "../utils/translateQuantity";



function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const { t } = useTranslate();
  const { lang } = useLanguage();



  useEffect(() => {
  getRecipeById(id, lang).then(setRecipe);
}, [id, lang]);


  if (!recipe) {
    return <div className="loading-screen">{t("loadingRecipe")}</div>;
  }

  return (
    <div className="recipe-detail-container">
      
    
      <div className="hero-section">
        
        <img src={recipe.photo} alt={recipe.name} className="hero-image" />
        
        <div className="hero-overlay">
          <h1 className="recipe-title">{recipe.name}</h1>
        </div>
      </div>

      
      <div className="content-wrapper">
        
        
        <div className="info-bar">
          <span className="badge badge-category">
            {recipe.category?.name || t("recipe")}
          </span>
          <span className={`badge ${recipe.is_vegan ? 'badge-vegan' : 'badge-nonvegan'}`}>
            {recipe.is_vegan ? `🌿 ${t("vegan")}` : `🍖 ${t("nonVegan")}`}
          </span>
        </div>

        
        <p className="description-text">{recipe.description}</p>

      
        <div className="recipe-grid">
          
          <aside className="ingredients-section">
            <h3 className="section-label">{t("ingredients")}</h3>
            <ul className="ingredients-list">
              {recipe.ingredients?.map((ing) => (
                <li key={ing.id} className="ingredient-item">
                  <span className="ingredient-name">{ing.ingredient.name}</span>
                  {/* <span className="ingredient-qty">{ing.quantity}</span> */}
                  <span className="ingredient-qty">
                    {translateQuantity(ing.quantity, lang)}
                  </span>

                </li>
              ))}
            </ul>
          </aside>

          <main className="instructions-section">
            <h3 className="section-label">{t("instructions")}</h3>
            <div className="instructions-card">
              {recipe.direction?.instruction}
            </div>
          </main>
           <button className="btn-back" onClick={() => navigate(-1)}>
          <span>←</span> {t("backToRecipes")}
        </button>
        </div>
      </div>
      
    </div>
  );
}

export default RecipeDetail;