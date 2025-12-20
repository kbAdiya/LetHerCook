import { USERS_API } from "./apiConfig";


export function getStatus() {
  return fetch(`${USERS_API}/status/`, {
    credentials: "include",
  }).then(res => {
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  });
}


export function login(username, password) {
  return fetch(`${USERS_API}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  }).then(res => res.json());
}


export function logout() {
  return fetch(`${USERS_API}/logout/`, {
    method: "POST",
    credentials: "include",
  }).then(res => res.json());
}


export function register({ username, email, password, passwordConfirm }) {
  return fetch(`${USERS_API}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    }),
  }).then(res => res.json());
}
