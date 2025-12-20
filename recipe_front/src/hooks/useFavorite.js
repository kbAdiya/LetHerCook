import { useState, useEffect } from "react";
import { addToFavorites, removeFromFavorites } from "../services/favoriteService";

export function useFavorite(recipeId, initialStatus = false, onFavoriteChange = null) {
  const [isFavorite, setIsFavorite] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    setIsFavorite(initialStatus);
  }, [initialStatus]);
  

  const toggleFavorite = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

   
    if (loading) return;

    setLoading(true);
    
    
    const oldState = isFavorite;
    const newState = !oldState;
    setIsFavorite(newState);

    try {
      if (oldState) {
        
        await removeFromFavorites(recipeId);
        
        if (onFavoriteChange) {
          onFavoriteChange(recipeId, false);
        }
      } else {
   
        await addToFavorites(recipeId);
     
        if (onFavoriteChange) {
          onFavoriteChange(recipeId, true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setIsFavorite(oldState); 
      alert("Ошибка сети.");
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, toggleFavorite, loading };
}