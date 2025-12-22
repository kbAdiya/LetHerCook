
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import RecipeCard from "./RecipeCard";
import { getAllRecipes } from "../services/recipeService";
import { getFavorites } from "../services/favoriteService"; 
import { useAuth } from "../context/AuthContext";
import "../styles/recipesearch.css";
import { useLanguage } from "../context/LanguageContext";
import { useTranslate } from "../i18n/useTranslate";


function RecipeSearch() {
  const [recipes, setRecipes] = useState([]);
  
  const { lang } = useLanguage();
  const { t } = useTranslate();

  
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth(); 

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialIsVeganParam = searchParams.get("is_vegan"); 
  const initialDiet =
    initialIsVeganParam === "true" ? "no_meat" : initialIsVeganParam === "false" ? "meat" : "all";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [diet, setDiet] = useState(initialDiet); 


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = {};
      if (searchTerm) params.ingredients = searchTerm;
      if (diet === "no_meat") params.is_vegan = "true";
      if (diet === "meat") params.is_vegan = "false";
      setSearchParams(params); 
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, diet, setSearchParams]);

  
  useEffect(() => {
  const query = searchParams.get("ingredients") || "";
  const isVeganParam = searchParams.get("is_vegan");
  const isVegan = isVeganParam === "true" ? true : isVeganParam === "false" ? false : undefined;

  getAllRecipes({ search: query, isVegan, lang })
    .then((data) => {
      if (Array.isArray(data)) {
        setRecipes(data);
      } else if (data.results && Array.isArray(data.results)) {
        setRecipes(data.results);
      } else {
        setRecipes([]);
      }
    })
    .catch((err) => console.error("Error fetching recipes:", err));
}, [searchParams, lang]);

-
  useEffect(() => {
    if (!user) {
        setFavoriteIds([]);
        return;
    }

    getFavorites()
      .then((data) => {
        const list = data.results || data || [];
       
        const ids = list.map(item => item.recipe ? item.recipe.id : item.id);
        
    
        setFavoriteIds(ids);
      })
      .catch(console.error);
  }, [user]);

  const handleClear = () => {
    setSearchTerm("");
    setDiet("all");
  };

  return (
    <div className="recipeSearchPage">
      
      <div className="recipeSearchPanelWrap">
        <div className="recipeSearchPanel">
         
          <div className="dietToggle" role="group" aria-label="Diet filter">
            <button
              type="button"
              className={diet === "all" ? "isActive" : ""}
              onClick={() => setDiet("all")}
            >
              {t("all")}
            </button>
            <button
              type="button"
              className={diet === "meat" ? "isActive" : ""}
              onClick={() => setDiet("meat")}
            >
             {t("hasMeat")}
            </button>
            <button
              type="button"
              className={diet === "no_meat" ? "isActive" : ""}
              onClick={() => setDiet("no_meat")}
            >
              {t("noMeat")}
            </button>
          </div>

          
          <input
            className="recipeSearchInput"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        
          <button className="recipeSearchClear" onClick={handleClear} type="button">
            {t("clear")}
          </button>
        </div>
      </div>

      <div className="recipeGrid">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
       
            initialIsFavorite={favoriteIds.includes(recipe.id)}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="recipeEmpty">{t("noRecipes")}</p>
      )}
    </div>
  );
}

export default RecipeSearch; 

