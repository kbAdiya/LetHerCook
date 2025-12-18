import { useAuth } from "../context/AuthContext"; // 1. Импортируем наш хук
import { useTranslate } from "../i18n/useTranslate";

function Profile() {
  // 2. Достаем пользователя напрямую из контекста (пропсы больше не нужны)
  const { user } = useAuth();
  const { t } = useTranslate();


  // Если пользователь не залогинен (user === null)
  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{t("notAuthorized")}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("profile")}</h1>
      <div className="profile-info">
        <h2>{t("hello")}, {user.username}!</h2>
        
        {/* Если у пользователя есть email, отобразим его */}
        {user.email && <p><strong>Email:</strong> {user.email}</p>}
        <p className="status-badge" style={{ color: "green" }}>
          {t("authorized")}
        </p>
      </div>
    </div>
  );
}

export default Profile;