
// import { API_URL } from "./apiConfig";

// export function getAllRecipes(filters = {}) {

//   const params = new URLSearchParams();

//   // Если есть текст в поиске, добавляем параметр ingredients
//   // (или 'search', если в Django используется SearchFilter)
//   if (filters.search) {
//     // Пользователь может ввести "potato, milk", убираем пробелы, чтобы было "potato,milk"
//     const cleanedSearch = filters.search.replace(/\s/g, "");
//     params.append("ingredients", cleanedSearch);
//   }

//   // Если включен веган-фильтр, добавляем параметр
//   if (filters.isVegan) {
//     params.append("is_vegan", "true");
//   }

//   // params.toString() сам сделает строку вида "ingredients=potato&is_vegan=true"
//   return fetch(`${API_URL}/recipes/?${params.toString()}`, {
//     credentials: "include",
//   }).then((res) => res.json());
// }

// export function getRecipeById(id) {
//   return fetch(`${API_URL}/recipes/${id}/`, { credentials: "include" }).then(
//     (res) => res.json()
//   );
// }

import { API_URL } from "./apiConfig";

// 1. Новая функция: получаем список категорий
export function getCategories() {
  return fetch(`${API_URL}/categories/`, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  });
}

// 2. Обновляем получение рецептов
export function getAllRecipes(filters = {}) {
  const params = new URLSearchParams();

  // Поиск по ингредиентам
  if (filters.search) {
    const cleanedSearch = filters.search.replace(/\s/g, "");
    params.append("ingredients", cleanedSearch);
  }

  // Meat/Vegan filter (API expects is_vegan=true/false)
  if (filters.isVegan === true) params.append("is_vegan", "true");
  if (filters.isVegan === false) params.append("is_vegan", "false");

  // --- НОВОЕ: Фильтр по категории ---
  // Если мы нажали кнопку категории, добавляем ?category__name=breakfast
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

export function getRecipeById(id) {
  return fetch(`${API_URL}/recipes/${id}/`, { credentials: "include" }).then(
    (res) => res.json()
  );
}