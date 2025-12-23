import { useEffect, useState } from "react";
import { getCategories, getAllRecipes } from "../services/recipeService";
import { getFavorites } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { useTranslate } from "../i18n/useTranslate";
import { useLanguage } from "../context/LanguageContext";

function Categories() {
  const { t } = useTranslate();
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCuisine, setActiveCuisine] = useState("All");

  useEffect(() => {
    getCategories(lang)
      .then(data => {
        const list = data?.results || data || [];
        setCategories(list);
        setActiveCategory("All");
      })
      .catch(err => console.error(err));
  }, [lang]);


  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/cuisines/")
    .then(res => res.json())
    .then(data => {
    
      setCuisines(data.results || []);
    })
    .catch(err => {
      console.error("Error loading cuisines:", err);
    });
}, []);


  useEffect(() => {
    const params = { lang };

    if (activeCategory !== "All") {
      params.category = activeCategory; 
    }

    if (activeCuisine !== "All") {
      params.cuisine = activeCuisine; 
    }

    getAllRecipes(params).then(data => {
      const list = data?.results || data || [];
      setRecipes(list);
    });
  }, [activeCategory, lang, activeCuisine]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    getFavorites().then(data => {
      const list = data?.results || data || [];
      setFavoriteIds(
        list.map(item => (item.recipe ? item.recipe.id : item.id))
      );
    });
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
            backgroundColor: activeCategory === "All" ? "#f4b20bff" : "#e0e0e0",
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
            backgroundColor:
              activeCategory === cat.name ? "#fdd10cff" : "#e0e0e0",
            color:
              activeCategory === cat.name ? "white" : "black"
          }}
        >
          {cat.name}
        </button>
      ))}
      </div>

     
      <h2 style={{ marginTop: "20px" }}>{t("cuisine")}</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveCuisine("All")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeCuisine === "All" ? "#f4b20bff" : "#e0e0e0",
            color: activeCuisine === "All" ? "white" : "black",
            fontWeight: "bold"
          }}
        >
          {t("allCuisines")}
        </button>

        {cuisines.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCuisine(c.name_en)}  
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                activeCuisine === c.name_en ? "#fdd10cff" : "#e0e0e0",
              color:
                activeCuisine === c.name_en ? "white" : "black"
            }}
          >
            {c[`name_${lang}`] || c.name_en}
          </button>
        ))}
      </div>

      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}
      >
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
