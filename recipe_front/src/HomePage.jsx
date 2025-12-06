import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 100; // Increased from 50 to show more recipes per page

  useEffect(() => {
    fetchRecipes();
  }, [offset, search]);

  async function fetchRecipes() {
    setLoading(true);
    setError("");
    try {
      // Increase default limit to show more recipes
      let url = `http://127.0.0.1:8000/api/recipes/?limit=${limit}&offset=${offset}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();
      setRecipes(data.results || []);
      setTotal(data.count || 0);
    } catch (e) {
      console.error("Error fetching recipes:", e);
      setError("Failed to load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setOffset(0);
    fetchRecipes();
  }

  function handleRecipeClick(recipeId) {
    navigate(`/recipe/${recipeId}`);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>Recipe Collection</h1>
        
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes by name..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
          <button
            type="submit"
            style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0ea5e9", color: "white", cursor: "pointer" }}
          >
            Search
          </button>
        </form>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/categories")}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
          >
            Browse Categories
          </button>
          <button
            onClick={() => navigate("/ingredient-search")}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
          >
            Search by Ingredients
          </button>
        </div>
      </div>

      {error && <div style={{ marginTop: 10, color: "#a16207", padding: 10, background: "#fef3c7", borderRadius: 8 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>Loading recipes...</div>
      ) : (
        <>
          <div style={{ marginBottom: 16, color: "#666" }}>
            Showing {recipes.length} of {total} recipes
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {recipes.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#666" }}>
                No recipes found. Try a different search term.
              </div>
            ) : (
              recipes.map((recipe) => (
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
              ))
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: offset === 0 ? "#f3f4f6" : "white",
                cursor: offset === 0 ? "not-allowed" : "pointer",
                opacity: offset === 0 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: offset + limit >= total ? "#f3f4f6" : "white",
                cursor: offset + limit >= total ? "not-allowed" : "pointer",
                opacity: offset + limit >= total ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;

