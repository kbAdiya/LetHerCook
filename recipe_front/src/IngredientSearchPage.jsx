import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function IngredientSearchPage() {
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState("");
  const [category, setCategory] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  }

  function addIngredient(e) {
    e.preventDefault();
    const trimmed = ingredient.trim().toLowerCase();
    if (!trimmed) return;
    if (!ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setIngredient("");
  }

  function removeIngredient(name) {
    setIngredients(ingredients.filter((i) => i !== name));
  }

  async function handleSearch(e) {
    e.preventDefault();
    
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/recipes/search-by-ingredients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ingredients: ingredients,
          cuisine: cuisine || null,
          category: category || null,
          vegetarian: vegetarian,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to search recipes");
      }

      const data = await res.json();
      setRecipes(data.results || []);
      
      if (data.results.length === 0) {
        setError("No recipes found matching your criteria");
      }
    } catch (e) {
      console.error("Error searching recipes:", e);
      setError(e.message || "Failed to search recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleRecipeClick(recipeId) {
    navigate(`/recipe/${recipeId}`);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <button
        onClick={() => navigate("/home")}
        style={{ marginBottom: 16, padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
      >
        ← Back to Home
      </button>

      <h1 style={{ marginBottom: 24 }}>Search Recipes by Ingredients</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
        {/* Ingredients Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Ingredients</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addIngredient(e);
                }
              }}
              placeholder="Add an ingredient (e.g., chicken, tomato, onion)"
              style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <button
              type="button"
              onClick={addIngredient}
              style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0ea5e9", color: "white", cursor: "pointer" }}
            >
              Add
            </button>
          </div>
          
          {ingredients.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  style={{
                    padding: "6px 12px",
                    background: "#0ea5e9",
                    color: "white",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing)}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: "white",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: 0,
                      width: 20,
                      height: 20,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Cuisine (optional)</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g., Italian, Mexican"
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            >
              <option value="">Any Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Dietary</label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={vegetarian}
                onChange={(e) => setVegetarian(e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span>Vegetarian</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || ingredients.length === 0}
          style={{
            width: "100%",
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            background: loading || ingredients.length === 0 ? "#9bd3f5" : "#0ea5e9",
            color: "white",
            cursor: loading || ingredients.length === 0 ? "not-allowed" : "pointer",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {loading ? "Searching..." : "Search Recipes"}
        </button>
      </form>

      {error && (
        <div style={{ marginBottom: 16, color: "#a16207", padding: 12, background: "#fef3c7", borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {recipes.length > 0 && (
        <div>
          <h2 style={{ marginBottom: 16 }}>Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.id)}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  {recipe.recipe_name}
                </div>
                {recipe.category && (
                  <div style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>
                    Category: {recipe.category}
                  </div>
                )}
                {recipe.cuisine_path && (
                  <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
                    Cuisine: {recipe.cuisine_path}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecipeClick(recipe.id);
                  }}
                  style={{
                    marginTop: 12,
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#0ea5e9",
                    color: "white",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Show Recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IngredientSearchPage;

