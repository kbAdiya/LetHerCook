import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./styles/landing.css";

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const isAuthenticated = Boolean(username);

  const prefillIngredients = location.state?.prefillIngredients || [];

  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState(prefillIngredients);
  const [diet, setDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const filterSectionRef = useRef(null);

  useEffect(() => {
    if (prefillIngredients.length) {
      setIngredients(prefillIngredients);
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

  function filterLocal(recipesList, selectedIngredients, d, c, t) {
    const timeNum = t ? parseInt(t, 10) : undefined;
    return recipesList.filter((r) => {
      if (selectedIngredients.length > 0) {
        const recipeIngredients = Array.isArray(r.ingredients) ? r.ingredients.map((i) => i.toLowerCase()) : [];
        const ingredientMatch = selectedIngredients.some((searchIng) =>
          recipeIngredients.some((recipeIng) => recipeIng.includes(searchIng.toLowerCase()))
        );
        if (!ingredientMatch) return false;
      }
      if (timeNum && r.minutes && r.minutes > timeNum) return false;
      if (d && r.diet && r.diet.toLowerCase() !== d.toLowerCase()) return false;
      if (c && r.cuisine && r.cuisine.toLowerCase() !== c.toLowerCase()) return false;
      return true;
    });
  }

  async function searchRecipes(selectedIngredients = ingredients, d = diet, c = cuisine, t = maxTime) {
    setLoading(true);
    setError("");
    setInfoMessage("");
    try {
      let url = "http://127.0.0.1:8000/api/recipes/";
      const params = new URLSearchParams();

      if (selectedIngredients.length > 0) {
        params.append("search", selectedIngredients.join(" "));
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();
      let allRecipes = Array.isArray(data) ? data : data.results || [];

      if (selectedIngredients.length > 0 || d || c || t) {
        allRecipes = filterLocal(allRecipes, selectedIngredients, d, c, t);
      }

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
    navigate("/", { replace: true });
  }

  function handleFavorites() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setInfoMessage("Favourites are coming soon. For now, keep searching with your pantry items!");
    filterSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function focusFilters() {
    filterSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="landing-page">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={isAuthenticated ? handleLogout : undefined}
        onFavorites={handleFavorites}
      />

      <div className="landing-container">
        {!isAuthenticated && (
          <>
            <section className="landing-hero">
            <div>
              <h1 className="landing-hero-title">Find recipes from what you already have</h1>
              <p className="landing-hero-description">
                Type the ingredients in your kitchen, filter by preferences, and instantly discover recipes that fit. Save
                time, reduce waste, and eat better.
              </p>
              <div className="landing-cta-links">
                <Link to="/register" className="landing-btn landing-btn--dark">
                  Get started
                </Link>
                <Link to="/login" className="landing-btn landing-btn--light">
                  I already have an account
                </Link>
              </div>
            </div>

            <div className="landing-preview-card">
              <div className="landing-preview-title">Preview the filters</div>
              <p className="landing-preview-text">
                Scroll down to try the same ingredient filters our members use every day. You can explore without logging in.
              </p>
              <button className="landing-btn landing-btn--primary landing-btn--block" onClick={focusFilters}>
                Jump to filters
              </button>
              <div className="landing-preview-note">
                When you’re ready to save favourites or get personalised results, create an account.
              </div>
            </div>
          </section>

            <section className="landing-feature-grid">
              <Feature title="Ingredient-first" description="Start with your pantry, not a shopping list." />
              <Feature title="Smart filtering" description="Exclude allergens, set diets, pick cuisines." />
              <Feature title="Waste less" description="Use what you own and save money." />
            </section>
          </>
        )}

        {isAuthenticated && (
          <section className="landing-welcome">
            <div className="landing-welcome-text">Welcome back, {username}</div>
            <button className="landing-btn landing-btn--outline landing-btn--small" onClick={() => navigate("/login")}>
              Switch account
            </button>
          </section>
        )}

        <section
          ref={filterSectionRef}
          className={`landing-filter-section ${!isAuthenticated ? "landing-filter-section--guest" : ""}`}
        >
          <div className="landing-filter-header">
            <h2 className="landing-section-title">{isAuthenticated ? "Your ingredients" : "Test-drive the filters"}</h2>
            {!isAuthenticated && (
              <div className="landing-filter-subtext">Log in later to keep searching without retyping.</div>
            )}
          </div>
          <form className="landing-ingredient-form" onSubmit={addIngredient}>
            <input
              className="landing-input"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Add an ingredient"
            />
            <button type="submit" className="landing-btn landing-btn--outline">
              Add
            </button>
          </form>

          {ingredients.length > 0 && (
            <div className="landing-chip-list">
              {ingredients.map((i) => (
                <span className="landing-chip" key={i}>
                  {i}
                  <button type="button" className="landing-chip-remove" onClick={() => removeIngredient(i)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="landing-filter-grid">
            <select value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option value="">Any diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
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
            />
          </div>

          <button
            className={`landing-btn landing-btn--primary landing-btn--block${loading ? " landing-btn--disabled" : ""}`}
            onClick={() => searchRecipes()}
            disabled={loading}
          >
            {loading ? "Searching…" : "Find recipes"}
          </button>

          {infoMessage && <div className="landing-info">{infoMessage}</div>}
          {error && <div className="landing-error">{error}</div>}

          <div className="landing-recipe-grid">
            {recipes.length === 0 && !loading && (
              <div className="landing-empty-state">
                No recipes found. Try adding ingredients or adjusting your filters.
              </div>
            )}
            {recipes.map((r) => (
              <div key={r.id || r.recipe_id || r.title} className="landing-recipe-card">
                <div className="landing-recipe-title">{r.title}</div>
                <div className="landing-recipe-source">{r.source && `Source: ${r.source.toUpperCase()}`}</div>
                {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
                  <div className="landing-recipe-ingredients">
                    <div className="landing-recipe-ingredients-label">Ingredients:</div>
                    <div className="landing-recipe-ingredients-list">
                      {r.ingredients.slice(0, 5).map((i, idx) => (
                        <span key={idx} className="landing-recipe-ingredient-chip">
                          {i}
                        </span>
                      ))}
                      {r.ingredients.length > 5 && (
                        <span className="landing-recipe-ingredient-more">+{r.ingredients.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}
                {r.instructions && (
                  <div className="landing-recipe-instructions">{r.instructions.substring(0, 100)}...</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="landing-feature-card">
      <div className="landing-feature-title">{title}</div>
      <div className="landing-feature-description">{description}</div>
    </div>
  );
}

export default Landing;


