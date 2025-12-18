import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/auth.css";
import { useTranslate } from "../i18n/useTranslate";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslate();

  function handleRegister(e) {
    e.preventDefault();
    register({ username, email, password, passwordConfirm })
      .then(data => {
        if (data.success) {
          alert(t("registerSuccess"));
          navigate("/login");
        } else {
          alert(data.error || t("registerError"));
        }
      })
      .catch(err => {
        console.error(err);
        alert(t("registerErrorGeneric"));
      });
  }

  return (
    <div className="auth-container">
      <h2>{t("register")}</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("passwordHint")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("confirmPassword")}
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        <button type="submit">{t("register")}</button>
      </form>

      <p>
        {t("haveAccount")} <a href="/login">{t("login")}</a>
      </p>
    </div>
  );
}

export default Register;
