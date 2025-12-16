
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // 1. Импортируем хук авторизации
// import logo from "../assets/logo.png";
// import heartIcon from "../assets/icons/heart.svg";
// import profileIcon from "../assets/icons/profile.svg";
// import "../styles/navbar.css";

// const NAV_LINKS = [
//   { label: "Home", to: "/" },
// ];

// // 2. Убираем пропсы (isAuthenticated, username, onLogout)
// function Navbar() {
//   // 3. Достаем данные напрямую из контекста
//   const { user, handleLogout } = useAuth();
  
//   // Проверяем, залогинен ли пользователь (если user не null)
//   const isAuthenticated = !!user;
//   const username = user?.username;

//   return (
//     <header className="navbar-wrapper">
//       <div className="navbar-top-line"></div>

//       <nav className="navbar">
//         <div className="navbar-container">

//           {/* LOGO */}
//           {/* Если залогинен - ведем на /home, если нет - на лендинг / */}
//           <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
//             <img
//               src={logo}
//               alt="LetHerCook logo"
//               className="navbar-logo"
//             />
//             <span>LetHerCook</span>
//           </Link>

//           {/* MENU */}
//           <ul className="navbar-menu">
//             {NAV_LINKS.map(({ label, to }) => (
//               <li key={label}>
//                 <Link to={to} className="navbar-menu-link">
//                   {label}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           {/* ACTIONS */}
//           <div className="navbar-actions">

//             {/* Favorites — только если авторизован */}
//             {isAuthenticated && (
//               <Link
//                 to="/favorites"
//                 className="navbar-icon-button"
//                 aria-label="Favorites"
//               >
//                 <img src={heartIcon} alt="Favorites" />
//               </Link>
//             )}

//             {isAuthenticated ? (
//               <>
//                 {/* PROFILE */}
//                 <Link
//                   to="/profile"
//                   className="navbar-profile-pill"
//                   title={username}
//                 >
//                   <img src={profileIcon} alt="Profile" />
//                   {/* Добавил проверку user?.username на всякий случай */}
//                   <span>{username}</span>
//                 </Link>

//                 {/* LOGOUT */}
//                 <button
//                   type="button"
//                   className="navbar-logout"
//                   onClick={handleLogout} 
//                 >
//                   Log out
//                 </button>
//               </>
//             ) : (
//               <div className="navbar-auth-links">
//                 <Link to="/login" className="navbar-login">
//                   Login
//                 </Link>
//                 <Link to="/register" className="navbar-signup">
//                   Sign up
//                 </Link>
//               </div>
//             )}
//           </div>

//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Navbar; 
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import heartIcon from "../assets/icons/heart.svg";
import profileIcon from "../assets/icons/profile.svg";
import "../styles/navbar.css";

// Убираем NAV_LINKS отсюда, перенесем логику внутрь компонента

function Navbar() {
  const { user, handleLogout } = useAuth();
  
  const isAuthenticated = !!user;
  const username = user?.username;

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top-line"></div>

      <nav className="navbar">
        <div className="navbar-container">

          {/* LOGO */}
          {/* Логотип тоже должен вести в правильное место */}
          <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
            <img
              src={logo}
              alt="LetHerCook logo"
              className="navbar-logo"
            />
            <span>LetHerCook</span>
          </Link>

          {/* MENU */}
          <ul className="navbar-menu">
            <li>
              
                <Link 
                  to={isAuthenticated ? "/home" : "/"} 
                  className="navbar-menu-link"
                >
                  Home
                </Link>
                <Link to="/about">About</Link>
                <Link to="/categories">Categories</Link>
            </li>
          </ul>

        
          <div className="navbar-actions">
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="navbar-icon-button"
                aria-label="Favorites"
              >
                <img src={heartIcon} alt="Favorites" />
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="navbar-profile-pill"
                  title={username}
                >
                  <img src={profileIcon} alt="Profile" />
                  <span>{username}</span>
                </Link>

                <button
                  type="button"
                  className="navbar-logout"
                  onClick={handleLogout} 
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/login" className="navbar-login">
                  Login
                </Link>
                <Link to="/register" className="navbar-signup">
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;