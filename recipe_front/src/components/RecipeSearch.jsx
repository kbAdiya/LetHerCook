
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import RecipeCard from "./RecipeCard";
import { getAllRecipes } from "../services/recipeService";
import { getFavorites } from "../services/favoriteService"; 
import { useAuth } from "../context/AuthContext";

function RecipeSearch() {
  const [recipes, setRecipes] = useState([]);
  
  
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth(); 

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialVegan = searchParams.get("is_vegan") === "true";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isVegan, setIsVegan] = useState(initialVegan);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (isVegan) params.is_vegan = "true";
      setSearchParams(params); 
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isVegan, setSearchParams]);

  
  useEffect(() => {
    const query = searchParams.get("search") || "";
    const vegan = searchParams.get("is_vegan") === "true";

    getAllRecipes({ search: query, isVegan: vegan })
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
  }, [searchParams]);
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

  // --- Обработчики ---
  const handleClear = () => {
    setSearchTerm("");
    setIsVegan(false);
  };

  const handleVeganChange = (e) => {
    setIsVegan(e.target.checked);
  };

  return (
    <div>
      {/* Search bar + Controls */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        
        <input
          type="text"
          placeholder="Enter ingredients like potato,milk"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px 12px", width: "250px" }}
        />

        {searchTerm && (
            <button 
                onClick={handleClear}
                style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                }}
            >
                Clear
            </button>
        )}

        <label style={{ fontWeight: "600", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isVegan}
            onChange={handleVeganChange}
            style={{ marginRight: "6px" }}
          />
          Only Vegan
        </label>
      </div>

      {/* Recipes List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            // 4. ВОТ ЗДЕСЬ МАГИЯ:
            // Проверяем, есть ли ID этого рецепта в списке любимых
            initialIsFavorite={favoriteIds.includes(recipe.id)}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <p style={{ marginTop: "20px", color: "#666" }}>No recipes found.</p>
      )}
    </div>
  );
}

export default RecipeSearch;