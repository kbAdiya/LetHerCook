import { useEffect, useState } from "react";
import { getCategories, getAllRecipes } from "../services/recipeService";
import { getFavorites } from "../services/favoriteService"; // Для красных сердечек
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { useTranslate } from "../i18n/useTranslate";


function Categories() {
  const [categories, setCategories] = useState([]); // Список кнопок
  const [recipes, setRecipes] = useState([]);       // Список рецептов
  const [activeCategory, setActiveCategory] = useState("All"); // Какая кнопка нажата прямо сейчас
  const { t } = useTranslate();

  // Для сердечек
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth();

  // 1. Загружаем список категорий (один раз при запуске)
  useEffect(() => {
    getCategories().then(data => {
      // Бэкенд возвращает { count: 4, results: [...] }
      if (data.results) {
        setCategories(data.results);
      }
    });
  }, []);

  // 2. Загружаем рецепты при изменении выбранной категории
  useEffect(() => {
    const params = {};
    
    // Если выбрано не "All", добавляем фильтр для бэкенда
    if (activeCategory !== "All") {
      params.category__name = activeCategory;
    }

    getAllRecipes(params).then(data => {
      // Обработка пагинации (если бэкенд возвращает results)
      const list = Array.isArray(data) ? data : (data.results || []);
      setRecipes(list);
    });
  }, [activeCategory]); // <-- Зависит от нажатой кнопки

  // 3. Загружаем избранное (чтобы сердечки были красными)
  useEffect(() => {
    if (user) {
      getFavorites().then(data => {
        const list = data.results || data || [];
        // Берем ID рецепта (учитываем вложенность, если она есть)
        const ids = list.map(item => item.recipe ? item.recipe.id : item.id);
        setFavoriteIds(ids);
      });
    } else {
        setFavoriteIds([]);
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("categories")}</h2>

      {/* Панель кнопок категорий */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {/* Кнопка "Все" */}
        <button
          onClick={() => setActiveCategory("All")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            // Если активна — синяя, иначе серая
            backgroundColor: activeCategory === "All" ? "#007bff" : "#e0e0e0",
            color: activeCategory === "All" ? "white" : "black",
            fontWeight: "bold"
          }}
        >
          {t("allCategories")}
        </button>

        {/* Кнопки из бэкенда */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              // Сравниваем имя категории с активной
              backgroundColor: activeCategory === cat.name ? "#007bff" : "#e0e0e0",
              color: activeCategory === cat.name ? "white" : "black",
              textTransform: "capitalize" // Делает первую букву заглавной (salad -> Salad)
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Сетка рецептов */}
      <div className="recipe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              initialIsFavorite={favoriteIds.includes(recipe.id)}
            />
          ))
        ) : (
          <p>{t("noRecipesInCategory")}</p>
        )}
      </div>
    </div>
  );
}

export default Categories;