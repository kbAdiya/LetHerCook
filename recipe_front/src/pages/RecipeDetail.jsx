
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 1. Импортируем useNavigate
import { getRecipeById } from "../services/recipeService";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // 2. Инициализируем хук
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    getRecipeById(id).then(setRecipe);
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* 3. Кнопка НАЗАД */}
      <button 
        onClick={() => navigate(-1)} // -1 возвращает на предыдущую страницу
        style={{
            marginBottom: "20px",
            padding: "8px 16px",
            cursor: "pointer",
            background: "none",
            border: "1px solid #333",
            borderRadius: "4px"
        }}
      >
        ← Back to Recipes
      </button>

      {/* Контент рецепта */}
      <h1>{recipe.name}</h1>
      <img 
        src={recipe.photo} 
        alt={recipe.name} 
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }} 
      />
      
      <p style={{ fontStyle: "italic", color: "#555" }}>
        Category: {recipe.category?.name} | {recipe.is_vegan ? "Vegan 🌿" : "Non-vegan 🍖"}
      </p>

      <h3>Description</h3>
      <p>{recipe.description}</p>

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients?.map((ing) => (
            <li key={ing.id}>
                {ing.ingredient.name} — {ing.quantity}
            </li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{recipe.direction?.instruction}</p>
    </div>
  );
}

export default RecipeDetail;