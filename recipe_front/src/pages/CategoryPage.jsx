import { useEffect, useState } from "react";
import { getCategories, getAllRecipes } from "../services/recipeService";
import { getFavorites } from "../services/favoriteService"; 
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { useTranslate } from "../i18n/useTranslate";


function Categories() {
  const [categories, setCategories] = useState([]); 
  const [recipes, setRecipes] = useState([]);       
  const [activeCategory, setActiveCategory] = useState("All"); 
  const { t } = useTranslate();

 
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth();

 
  useEffect(() => {
    getCategories().then(data => {
   
      if (data.results) {
        setCategories(data.results);
      }
    });
  }, []);

  
  useEffect(() => {
    const params = {};
    
    
    if (activeCategory !== "All") {
      params.category__name = activeCategory;
    }

    getAllRecipes(params).then(data => {
      
      const list = Array.isArray(data) ? data : (data.results || []);
      setRecipes(list);
    });
  }, [activeCategory]); 


  useEffect(() => {
    if (user) {
      getFavorites().then(data => {
        const list = data.results || data || [];
        
        const ids = list.map(item => item.recipe ? item.recipe.id : item.id);
        setFavoriteIds(ids);
      });
    } else {
        setFavoriteIds([]);
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("categories")}</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
       
        <button
          onClick={() => setActiveCategory("All")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            
            backgroundColor: activeCategory === "All" ? "#007bff" : "#e0e0e0",
            color: activeCategory === "All" ? "white" : "black",
            fontWeight: "bold"
          }}
        >
          {t("allCategories")}
        </button>

        
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
             
              backgroundColor: activeCategory === cat.name ? "#007bff" : "#e0e0e0",
              color: activeCategory === cat.name ? "white" : "black",
              textTransform: "capitalize" 
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      
      <div className="recipe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              initialIsFavorite={favoriteIds.includes(recipe.id)}
            />
          ))
        ) : (
          <p>{t("noRecipesInCategory")}</p>
        )}
      </div>
    </div>
  );
}

export default Categories;