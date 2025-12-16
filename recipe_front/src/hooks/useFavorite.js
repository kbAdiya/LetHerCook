import { useState, useEffect } from "react";
import { addToFavorites, removeFromFavorites } from "../services/favoriteService";

export function useFavorite(recipeId, initialStatus = false) {
  const [isFavorite, setIsFavorite] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  // --- ВОТ ЭТО НУЖНО ДОБАВИТЬ ---
  // Если родитель (RecipeSearch) узнал, что рецепт лайкнут,
  // он передаст новое значение initialStatus.
  // Мы должны обновить наш локальный стейт.
  useEffect(() => {
    setIsFavorite(initialStatus);
  }, [initialStatus]);
  // -----------------------------

  const toggleFavorite = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // Если уже идет загрузка, не даем кликать повторно
    if (loading) return;

    setLoading(true);
    
    // Оптимистичный интерфейс: сразу меняем цвет, не дожидаясь ответа сервера
    // (так интерфейс кажется быстрее)
    const oldState = isFavorite;
    setIsFavorite(!oldState);

    try {
      if (oldState) {
        // Было true, значит удаляем
        await removeFromFavorites(recipeId);
        // setIsFavorite(false) — уже сделали выше
      } else {
        // Было false, значит добавляем
        await addToFavorites(recipeId);
        // setIsFavorite(true) — уже сделали выше
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Если ошибка — возвращаем как было
      setIsFavorite(oldState); 
      alert("Ошибка сети. Не удалось обновить избранное.");
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, toggleFavorite, loading };
}