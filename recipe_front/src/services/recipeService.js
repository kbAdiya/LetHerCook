import { API_URL } from "./apiConfig";



export function getCategories() {
  return fetch(`${API_URL}/categories/`, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  });
}

export function getAllRecipes(filters = {}) {
  const params = new URLSearchParams();


  if (filters.search) {
    const cleanedSearch = filters.search.replace(/\s/g, "");
    params.append("ingredients", cleanedSearch);
  }

  if (filters.isVegan === true) params.append("is_vegan", "true");
  if (filters.isVegan === false) params.append("is_vegan", "false");

  if (filters.category__name) {
    params.append("category__name", filters.category__name);
  }
  
  if (filters.lang) {
    params.append("lang", filters.lang);
  }

  return fetch(`${API_URL}/recipes/?${params.toString()}`, {
    credentials: "include",
  }).then((res) => res.json());
}

export function getRecipeById(id, lang = "en") {
  return fetch(`${API_URL}/recipes/${id}/?lang=${lang}`, {
    credentials: "include",
  }).then(res => res.json());
}