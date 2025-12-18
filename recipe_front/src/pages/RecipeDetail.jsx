
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; 
// import { getRecipeById } from "../services/recipeService";

// function RecipeDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate(); 
//   const [recipe, setRecipe] = useState(null);

//   useEffect(() => {
//     getRecipeById(id).then(setRecipe);
//   }, [id]);

//   if (!recipe) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      
     
//       <button 
//         onClick={() => navigate(-1)} 
//         style={{
//             marginBottom: "20px",
//             padding: "8px 16px",
//             cursor: "pointer",
//             background: "none",
//             border: "1px solid #333",
//             borderRadius: "4px"
//         }}
//       >
//         ← Back to Recipes
//       </button>

     
//       <h1>{recipe.name}</h1>
//       <img 
//         src={recipe.photo} 
//         alt={recipe.name} 
//         style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }} 
//       />
      
//       <p style={{ fontStyle: "italic", color: "#555" }}>
//         Category: {recipe.category?.name} | {recipe.is_vegan ? "Vegan 🌿" : "Non-vegan 🍖"}
//       </p>

//       <h3>Description</h3>
//       <p>{recipe.description}</p>

//       <h3>Ingredients</h3>
//       <ul>
//         {recipe.ingredients?.map((ing) => (
//             <li key={ing.id}>
//                 {ing.ingredient.name} — {ing.quantity}
//             </li>
//         ))}
//       </ul>

//       <h3>Instructions</h3>
//       <p style={{ whiteSpace: "pre-wrap" }}>{recipe.direction?.instruction}</p>
//     </div>
//   );
// }

// export default RecipeDetail; 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import "../styles/recipedetail.css"
import { useTranslate } from "../i18n/useTranslate";


function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const { t } = useTranslate();


  useEffect(() => {
    getRecipeById(id).then(setRecipe);
  }, [id]);

  if (!recipe) {
    return <div className="loading-screen">{t("loadingRecipe")}</div>;
  }

  return (
    <div className="recipe-detail-container">
      
      {/* Hero Section */}
      <div className="hero-section">
        
        <img src={recipe.photo} alt={recipe.name} className="hero-image" />
        
        <div className="hero-overlay">
          <h1 className="recipe-title">{recipe.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        
        {/* Category and Diet Badges */}
        <div className="info-bar">
          <span className="badge badge-category">
            {recipe.category?.name || t("recipe")}
          </span>
          <span className={`badge ${recipe.is_vegan ? 'badge-vegan' : 'badge-nonvegan'}`}>
            {recipe.is_vegan ? `🌿 ${t("vegan")}` : `🍖 ${t("nonVegan")}`}
          </span>
        </div>

        {/* Description */}
        <p className="description-text">{recipe.description}</p>

        {/* Ingredients & Instructions Grid */}
        <div className="recipe-grid">
          
          <aside className="ingredients-section">
            <h3 className="section-label">{t("ingredients")}</h3>
            <ul className="ingredients-list">
              {recipe.ingredients?.map((ing) => (
                <li key={ing.id} className="ingredient-item">
                  <span className="ingredient-name">{ing.ingredient.name}</span>
                  <span className="ingredient-qty">{ing.quantity}</span>
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