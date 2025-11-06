import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  function addIngredient(e) {
    e.preventDefault();
    const trimmed = ingredient.trim();
    if (!trimmed) return;
    if (!ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
    }
    setIngredient("");
  }

  function removeIngredient(name) {
    setIngredients(ingredients.filter((i) => i !== name));
  }

  function trySearch() {
    const isLoggedIn = Boolean(localStorage.getItem("username"));
    if (isLoggedIn) {
      navigate("/home", { state: { prefillIngredients: ingredients } });
    } else {
      navigate("/login");
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>LetHerCook</div>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </nav>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36 }}>Find recipes from what you already have</h1>
          <p style={{ color: "#555", marginTop: 12 }}>
            Type the ingredients in your kitchen, filter by preferences, and instantly
            discover recipes that fit. Save time, reduce waste, and eat better.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Link to="/register" style={{ padding: "10px 14px", background: "#111", color: "#fff", textDecoration: "none", borderRadius: 8 }}>Get started</Link>
            <Link to="/login" style={{ padding: "10px 14px", background: "#eee", color: "#111", textDecoration: "none", borderRadius: 8 }}>I already have an account</Link>
          </div>
        </div>

        <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12, background: "#fafafa" }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Try it now</div>
          <form onSubmit={addIngredient} style={{ display: "flex", gap: 8 }}>
            <input
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g. chicken, tomato, rice"
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

          <button onClick={trySearch} style={{ marginTop: 14, width: "100%", padding: "10px 14px", borderRadius: 8, border: 0, background: "#0ea5e9", color: "white" }}>
            Find recipes
          </button>

          <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            You’ll be asked to log in to see full results.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Feature title="Ingredient-first" description="Start with your pantry, not a shopping list." />
        <Feature title="Smart filtering" description="Exclude allergens, set diets, pick cuisines." />
        <Feature title="Waste less" description="Use what you own and save money." />
      </section>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ color: "#555", marginTop: 6 }}>{description}</div>
    </div>
  );
}

export default Landing;


