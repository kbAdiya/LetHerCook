import { API_URL } from "./apiConfig";

// Получить список всех избранных (для страницы Favorites)
export function getFavorites() {
  return fetch(`${API_URL}/favorites/`, {
    headers: {
      "Authorization": `Token ${localStorage.getItem('token')}` // Или как у вас передается токен
      // Если используете cookies/session, оставьте credentials: "include"
    },
    credentials: "include", 
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  });
}

// Добавить в избранное
export function addToFavorites(recipeId) {
  return fetch(`${API_URL}/recipes/${recipeId}/favorite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Добавьте заголовок авторизации если нужно, или положитесь на cookies
    },
    credentials: "include",
  }).then(res => {
    if (!res.ok) throw new Error("Error adding to favorites");
    return res.json();
  });
}

// Удалить из избранного
export function removeFromFavorites(recipeId) {
  return fetch(`${API_URL}/recipes/${recipeId}/favorite/remove/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(res => {
    if (!res.ok) throw new Error("Error removing from favorites");
    return res; 
  });
}