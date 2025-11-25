import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/auth.css"
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        return res.json().then(data => {
          if (res.ok) {
            if (data.success || data.message) {
              alert("Успешно зарегистрирован! Пожалуйста, войдите.");
              navigate("/login");
            }
          } else {
            alert(data.error || "Ошибка при регистрации");
          }
        });
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Ошибка при регистрации. Попробуйте еще раз.");
      });
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
