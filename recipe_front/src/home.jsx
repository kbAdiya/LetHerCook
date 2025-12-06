import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const prefillIngredients = location.state?.prefillIngredients || [];

  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState(prefillIngredients);
  const [diet, setDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  useEffect(() => {
    // Load initial recipes when component mounts
    if (prefillIngredients.length) {
      setIngredients(prefillIngredients);
      // Run initial search with prefilled ingredients
      searchRecipes(prefillIngredients, diet, cuisine, maxTime);
    } else {
      // Load initial recipes without search
      loadInitialRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload recipes when cuisine changes (if no ingredients)
  useEffect(() => {
    if (ingredients.length === 0 && !loading) {
      loadInitialRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuisine]);

  async function loadInitialRecipes() {
    setLoading(true);
    setError("");
    try {
      let url = "http://127.0.0.1:8000/api/recipes/?limit=100&offset=0";
      // Add cuisine filter if selected
      if (cuisine) {
        url += `&cuisine=${encodeURIComponent(cuisine)}`;
      }
      
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to fetch recipes (Status: ${res.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setRecipes(data.results || []);
    } catch (e) {
      console.error("Error fetching recipes:", e);
      const errorMsg = e.message || "Failed to load recipes. Please check if the backend server is running at http://127.0.0.1:8000";
      setError(errorMsg);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  function addIngredient(e) {
    e.preventDefault();
    const trimmed = ingredient.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (!ingredients.includes(normalized)) {
      setIngredients([...ingredients, normalized]);
    }
    setIngredient("");
  }

  function removeIngredient(name) {
    setIngredients(ingredients.filter((i) => i !== name));
  }

  const sampleRecipes = useMemo(
    () => [
      { id: 1, title: "Tomato Chicken Rice Bowl", minutes: 25, cuisine: "global", diet: "", ingredients: ["chicken", "tomato", "rice"] },
      { id: 2, title: "Veggie Pasta", minutes: 20, cuisine: "italian", diet: "vegetarian", ingredients: ["pasta", "tomato", "garlic"] },
      { id: 3, title: "Chickpea Curry", minutes: 30, cuisine: "indian", diet: "vegan", ingredients: ["chickpeas", "tomato", "onion"] },
    ],
    []
  );

  function filterLocal(recipesList, selectedIngredients, d, c, t) {
    const timeNum = t ? parseInt(t, 10) : undefined;
    return recipesList.filter((r) => {
      // Check ingredients - match if any ingredient contains the search term
      if (selectedIngredients.length > 0) {
        const recipeIngredients = Array.isArray(r.ingredients) 
          ? r.ingredients.map(i => i.toLowerCase()) 
          : [];
        const ingredientMatch = selectedIngredients.some(searchIng => 
          recipeIngredients.some(recipeIng => recipeIng.includes(searchIng.toLowerCase()))
        );
        if (!ingredientMatch) return false;
      }
      // Note: diet, cuisine, and time filters are not in the JSON data structure
      // These would need to be added to the Recipe model or filtered differently
      return true;
    });
  }

  async function searchRecipes(selectedIngredients = ingredients, d = diet, c = cuisine, t = maxTime) {
    setLoading(true);
    setError("");
    try {
      let data;
      
      // If ingredients are provided, use the ingredient search endpoint
      if (selectedIngredients.length > 0) {
        const res = await fetch("http://127.0.0.1:8000/api/recipes/search-by-ingredients/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ingredients: selectedIngredients,
            cuisine: c || null,
            category: null, // Can add category filter later if needed
            vegetarian: d === 'vegetarian' || d === 'vegan',
          }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to search recipes");
        }
        
        data = await res.json();
      } else {
        // Otherwise, just fetch recipes normally with filters
        let url = "http://127.0.0.1:8000/api/recipes/?limit=100&offset=0";
        if (c) {
          url += `&cuisine=${encodeURIComponent(c)}`;
        }
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Failed to fetch recipes");
        data = await res.json();
      }
      
      // Handle paginated response (DRF returns {results: [...]}) or direct array
      let allRecipes = Array.isArray(data) ? data : (data.results || []);
      
      // Limit to first 100 recipes for display (to avoid overwhelming the UI)
      setRecipes(allRecipes.slice(0, 100));
    } catch (e) {
      console.error("Error fetching recipes:", e);
      const errorMsg = e.message || "Failed to load recipes. Please check if the backend server is running at http://127.0.0.1:8000";
      setError(errorMsg);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("http://127.0.0.1:8000/api/users/logout/", { method: "POST", credentials: "include" });
    } catch (_) {}
    localStorage.clear();
    navigate("/login");
  }

  async function handleLike(recipe, e) {
    e.stopPropagation(); // Prevent card click
    
    if (!username) {
      alert("Please log in to like recipes");
      navigate("/login");
      return;
    }
    
    const recipeId = recipe.id;
    const isFavorited = recipe.is_favorited || false;
    
    try {
      const endpoint = isFavorited ? 'unlike' : 'like';
      const res = await fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (res.ok) {
        // Update the recipe in the recipes array
        setRecipes(recipes.map(r => 
          r.id === recipeId 
            ? { ...r, is_favorited: !isFavorited }
            : r
        ));
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403 || res.status === 401) {
          alert("Please log in to like recipes");
          navigate("/login");
        } else {
          alert(errorData.error || "Failed to update favorite");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating favorite. Please try again.");
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>Welcome, {username}</div>
        <button onClick={handleLogout} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "white" }}>Logout</button>
      </div>

      <h2 style={{ marginTop: 8 }}>Your ingredients</h2>
      <form onSubmit={addIngredient} style={{ display: "flex", gap: 8 }}>
        <input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Add an ingredient"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "white" }}>Add</button>
      </form>

      {ingredients.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ingredients.map((i) => (
            <span key={i} style={{ padding: "6px 10px", background: "#fff", border: "1px solid #ddd", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}>
              {i}
              <button type="button" onClick={() => removeIngredient(i)} style={{ border: 0, background: "transparent", cursor: "pointer" }}>×</button>
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">Any diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">Any cuisine</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
          <option value="Global">Global</option>
          <option value="Mexican">Mexican</option>
          <option value="Asian">Asian</option>
          <option value="American">American</option>
        </select>
        <input
          type="number"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
          placeholder="Max minutes"
          min="0"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <button onClick={() => {
        if (ingredients.length > 0) {
          searchRecipes();
        } else {
          // If no ingredients, just reload with current filters
          loadInitialRecipes();
        }
      }} disabled={loading} style={{ marginTop: 14, width: "100%", padding: "10px 14px", borderRadius: 8, border: 0, background: loading ? "#9bd3f5" : "#0ea5e9", color: "white" }}>
        {loading ? "Searching…" : ingredients.length > 0 ? "Find recipes" : "Apply Filters"}
      </button>

      {error && <div style={{ marginTop: 10, color: "#a16207" }}>{error}</div>}

      <div style={{ marginTop: 20, display: "flex", gap: 12, marginBottom: 12 }}>
        <button 
          onClick={() => navigate("/favorites")}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
        >
          View Favorites
        </button>
        <button 
          onClick={() => navigate("/recipes")}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
        >
          Browse All Recipes
        </button>
        <button 
          onClick={() => navigate("/ingredient-search")}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
        >
          Search by Ingredients
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          Loading recipes...
        </div>
      )}

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {recipes.length === 0 && !loading && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#666" }}>
            No recipes found. Try adding ingredients or adjusting your filters, or click "Browse All Recipes" to see all recipes.
          </div>
        )}
        {recipes.map((r) => (
          <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, position: "relative", cursor: "pointer" }}
               onClick={() => navigate(`/recipe/${r.id}`)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{r.recipe_name}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(r, e);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 20,
                  padding: "4px 8px",
                  color: r.is_favorited ? "#ef4444" : "#ccc"
                }}
                title={r.is_favorited ? "Unlike" : "Like"}
              >
                {r.is_favorited ? "❤️" : "🤍"}
              </button>
            </div>
            {r.category && (
              <div style={{ color: "#666", marginBottom: 4, fontSize: 12 }}>
                Category: {r.category}
              </div>
            )}
            {r.cuisine_path && (
              <div style={{ color: "#666", marginBottom: 8, fontSize: 12 }}>
                Cuisine: {r.cuisine_path}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipe/${r.id}`);
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
  );
}

export default Home;
