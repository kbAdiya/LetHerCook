import { useAuth } from "../context/AuthContext"; // 1. Импортируем наш хук

function Profile() {
  // 2. Достаем пользователя напрямую из контекста (пропсы больше не нужны)
  const { user } = useAuth();

  // Если пользователь не залогинен (user === null)
  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Вы не авторизованы. Пожалуйста, войдите в систему.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Профиль</h1>
      <div className="profile-info">
        <h2>Привет, {user.username}!</h2>
        
        {/* Если у пользователя есть email, отобразим его */}
        {user.email && <p><strong>Email:</strong> {user.email}</p>}
        <p className="status-badge" style={{ color: "green" }}>
          Вы успешно авторизованы
        </p>
      </div>
    </div>
  );
}

export default Profile;