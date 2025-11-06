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
    if (prefillIngredients.length) {
      setIngredients(prefillIngredients);
      // Run initial search with prefilled ingredients
      searchRecipes(prefillIngredients, diet, cuisine, maxTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Fetch all recipes from backend
      let url = "http://127.0.0.1:8000/api/recipes/";
      const params = new URLSearchParams();
      
      // Add search query if ingredients are provided
      if (selectedIngredients.length > 0) {
        params.append('search', selectedIngredients.join(' '));
      }
      
      // Add source filter if needed (optional)
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch recipes");
      
      const data = await res.json();
      // Handle paginated response (DRF returns {results: [...]}) or direct array
      let allRecipes = Array.isArray(data) ? data : (data.results || []);
      
      // Filter recipes client-side based on ingredients, diet, cuisine, time
      if (selectedIngredients.length > 0 || d || c || t) {
        allRecipes = filterLocal(allRecipes, selectedIngredients, d, c, t);
      }
      
      // Limit to first 100 recipes for display (to avoid overwhelming the UI)
      setRecipes(allRecipes.slice(0, 100));
    } catch (e) {
      console.error("Error fetching recipes:", e);
      setError("Failed to load recipes. Please try again.");
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
          <option value="italian">Italian</option>
          <option value="indian">Indian</option>
          <option value="global">Global</option>
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

      <button onClick={() => searchRecipes()} disabled={loading} style={{ marginTop: 14, width: "100%", padding: "10px 14px", borderRadius: 8, border: 0, background: loading ? "#9bd3f5" : "#0ea5e9", color: "white" }}>
        {loading ? "Searching…" : "Find recipes"}
      </button>

      {error && <div style={{ marginTop: 10, color: "#a16207" }}>{error}</div>}

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {recipes.length === 0 && !loading && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#666" }}>
            No recipes found. Try adding ingredients or adjusting your filters.
          </div>
        )}
        {recipes.map((r) => (
          <div key={r.id || r.recipe_id || r.title} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, cursor: "pointer" }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{r.title}</div>
            <div style={{ color: "#666", marginBottom: 8, fontSize: 12 }}>
              {r.source && `Source: ${r.source.toUpperCase()}`}
            </div>
            {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Ingredients:</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxHeight: 100, overflow: "hidden" }}>
                  {r.ingredients.slice(0, 5).map((i, idx) => (
                    <span key={idx} style={{ padding: "4px 8px", border: "1px solid #eee", borderRadius: 999, fontSize: 11 }}>{i}</span>
                  ))}
                  {r.ingredients.length > 5 && (
                    <span style={{ padding: "4px 8px", color: "#666", fontSize: 11 }}>+{r.ingredients.length - 5} more</span>
                  )}
                </div>
              </div>
            )}
            {r.instructions && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#666", maxHeight: 60, overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.instructions.substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
