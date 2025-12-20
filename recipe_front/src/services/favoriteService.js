import { API_URL } from "./apiConfig";


export function getFavorites() {
  return fetch(`${API_URL}/favorites/`, {
    headers: {
      "Authorization": `Token ${localStorage.getItem('token')}` 
      
    },
    credentials: "include", 
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  });
}


export function addToFavorites(recipeId) {
  return fetch(`${API_URL}/recipes/${recipeId}/favorite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    
    },
    credentials: "include",
  }).then(res => {
    if (!res.ok) throw new Error("Error adding to favorites");
    return res.json();
  });
}


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