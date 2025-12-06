import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RecipePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  async function fetchRecipe() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/recipes/${id}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 404) {
          throw new Error(errorData.error || "Recipe not found");
        }
        throw new Error(errorData.error || "Failed to fetch recipe");
      }

      const data = await res.json();
      setRecipe(data);
      setIsFavorited(data.is_favorited || false);
    } catch (e) {
      console.error("Error fetching recipe:", e);
      setError(e.message || "Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    if (!username) {
      alert("Please log in to like recipes");
      navigate("/login");
      return;
    }

    try {
      const endpoint = isFavorited ? 'unlike' : 'like';
      const res = await fetch(`http://127.0.0.1:8000/api/recipes/${id}/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.is_favorited !== undefined ? data.is_favorited : !isFavorited);
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
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

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <button
          onClick={() => navigate("/home")}
          style={{ marginBottom: 16, padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
        >
          ← Back to Home
        </button>
        <div style={{ color: "#a16207", padding: 16, background: "#fef3c7", borderRadius: 8 }}>{error}</div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <button
        onClick={() => navigate("/home")}
        style={{ marginBottom: 16, padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
      >
        ← Back to Home
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
          <h1 style={{ margin: 0, flex: 1 }}>{recipe.recipe_name}</h1>
          {username && (
            <button
              onClick={handleLike}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 24,
                padding: "8px",
                color: isFavorited ? "#ef4444" : "#ccc",
              }}
              title={isFavorited ? "Unlike" : "Like"}
            >
              {isFavorited ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16, color: "#666" }}>
          {recipe.category && (
            <div>
              <strong>Category:</strong> {recipe.category}
            </div>
          )}
          {recipe.cuisine_path && (
            <div>
              <strong>Cuisine:</strong> {recipe.cuisine_path}
            </div>
          )}
          {recipe.minutes && (
            <div>
              <strong>Total Time:</strong> {recipe.minutes} minutes
            </div>
          )}
          {recipe.prep_time && (
            <div>
              <strong>Prep Time:</strong> {recipe.prep_time}
            </div>
          )}
          {recipe.cook_time && (
            <div>
              <strong>Cook Time:</strong> {recipe.cook_time}
            </div>
          )}
          {recipe.total_time && !recipe.minutes && (
            <div>
              <strong>Total Time:</strong> {recipe.total_time}
            </div>
          )}
          {recipe.servings && (
            <div>
              <strong>Servings:</strong> {recipe.servings}
            </div>
          )}
          {recipe.rating && (
            <div>
              <strong>Rating:</strong> {recipe.rating.toFixed(1)} ⭐
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16, borderBottom: "2px solid #0ea5e9", paddingBottom: 8 }}>Ingredients</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                style={{
                  padding: "12px",
                  marginBottom: 8,
                  background: "#f9fafb",
                  borderRadius: 8,
                  borderLeft: "4px solid #0ea5e9",
                }}
              >
                <strong>{ing.name}:</strong> {ing.raw_text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Directions */}
      {recipe.directions && recipe.directions.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16, borderBottom: "2px solid #0ea5e9", paddingBottom: 8 }}>Directions</h2>
          <ol style={{ paddingLeft: 20 }}>
            {recipe.directions.map((direction, idx) => (
              <li
                key={idx}
                style={{
                  padding: "12px",
                  marginBottom: 12,
                  background: "#f9fafb",
                  borderRadius: 8,
                }}
              >
                {direction.instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recipe data is fetched from database - no external link needed */}
    </div>
  );
}

export default RecipePage;

