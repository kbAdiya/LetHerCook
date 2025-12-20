import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getStatus } from "../services/authService";
import "../styles/auth.css";
import { useTranslate } from "../i18n/useTranslate";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslate();

function handleSubmit(e) {
    e.preventDefault();
    
    login(username, password)
      .then(data => {
        if (data.success) {
         
          return getStatus(); 
        } else {
          
          throw new Error(data.error || t("loginError"));
        }
      })
      .then(userData => {
    
        setUser(userData);
        
     
        navigate("/home");
      })
      .catch(err => {
        console.error(err);
        alert(err.message || t("loginErrorGeneric"));
      });
  }
  return (
    <div className="auth-container">
      <h2>{t("login")}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{t("login")}</button>
      </form>

      <p>
        {t("noAccount")} <a href="/register">{t("register")}</a>
      </p>
    </div>
  );
}

export default Login;
