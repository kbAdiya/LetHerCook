import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Favorites() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [username, navigate]);

  async function fetchFavorites() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/recipes/favorites/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch favorites");
      }

      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching favorites:", e);
      setError("Failed to load favorites. Please try again.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlike(recipe, e) {
    e.stopPropagation();
    const recipeId = recipe.id;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/unlike/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        // Remove from favorites list
        setFavorites(favorites.filter(r => r.id !== recipeId));
      } else {
        alert("Failed to unlike recipe");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error unliking recipe");
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
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => navigate("/home")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
          >
            Back to Home
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: 8 }}>Your Favorite Recipes</h2>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          Loading favorites...
        </div>
      )}

      {error && <div style={{ marginTop: 10, color: "#a16207" }}>{error}</div>}

      {!loading && favorites.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          No favorite recipes yet. Start liking recipes to see them here!
        </div>
      )}

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {favorites.map((r) => (
          <div key={r.id || r.recipe_id || r.title} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{r.title}</div>
              <button
                onClick={(e) => handleUnlike(r, e)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 20,
                  padding: "4px 8px",
                  color: "#ef4444"
                }}
                title="Unlike"
              >
                ❤️
              </button>
            </div>
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

export default Favorites;


