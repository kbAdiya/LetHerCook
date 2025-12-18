import { useEffect, useState } from "react";
import { getFavorites } from "../services/favoriteService";
import RecipeCard from "../components/RecipeCard";
import { useTranslate } from "../i18n/useTranslate";


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    getFavorites()
      .then(data => {
        // Твой JSON показывает, что рецепты лежат в data.results
        if (data.results) {
            setFavorites(data.results);
        } else {
            setFavorites([]);
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки избранного:", err);
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div>
      <h2>{t("myFavorites")}</h2>
      <div className="recipe-grid">
        {favorites.length > 0 ? (
          favorites.map(recipe => (
            // Внимание: здесь recipe — это сразу объект рецепта, 
            // так как мы находимся в "Избранном", сердце сразу красное (initialIsFavorite={true})
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              initialIsFavorite={true} 
            />
          ))
        ) : (
          <p>{t("noFavorites")}</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;