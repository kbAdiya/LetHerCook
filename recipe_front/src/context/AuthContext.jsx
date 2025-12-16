import { createContext, useContext, useState, useEffect } from "react";
import { getStatus, logout as apiLogout } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);


  useEffect(() => {
    getStatus()
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  function handleLogout() {
    apiLogout().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
