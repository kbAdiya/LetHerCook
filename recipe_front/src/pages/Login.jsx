import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getStatus } from "../services/authService";
import "../styles/auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   login(username, password)
  //     .then(data => {
  //       if (data.success && data.username) {
  //         setUser(data);
  //         navigate("/home");
  //       } else {
  //         alert(data.error || "Incorrect credentials");
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       alert("Error logging in. Please try again.");
  //     });
  // }
function handleSubmit(e) {
    e.preventDefault();
    
    // 1. Делаем запрос на логин
    login(username, password)
      .then(data => {
        if (data.success) {
          // 2. Логин прошел! Теперь ВРУЧНУЮ запрашиваем актуальный профиль
          // Это гарантирует, что данные будут такими же, как при обновлении страницы
          return getStatus(); 
        } else {
          // Если сервер вернул ошибку в data.error
          throw new Error(data.error || "Ошибка входа");
        }
      })
      .then(userData => {
        // 3. Получили данные профиля (из getStatus)
        // Обновляем глобальный стейт
        setUser(userData);
        
        // 4. И только теперь переходим на главную
        navigate("/home");
      })
      .catch(err => {
        console.error(err);
        alert(err.message || "Ошибка при входе. Проверьте данные.");
      });
  }
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
