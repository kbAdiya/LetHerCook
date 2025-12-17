// import { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import RootLayout from "./layouts/RootLayout";
// import { BrowserRouter } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Favorites from "./pages/Favorites";
// import RecipeDetail from "./pages/RecipeDetail";
// import { AuthProvider } from "./context/AuthContext";
// import { getStatus, logout } from "./services/authService";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     getStatus()
//       .then(data => setUser(data))
//       .catch(() => setUser(null));
//   }, []);

//   function handleLogout() {
//     logout().then(() => setUser(null));
//   }

//   return (
//         <AuthProvider>
//      <BrowserRouter>
//     <Routes>
//       <Route
//         element={
//           <RootLayout
//             isAuthenticated={!!user}
//             user={user}
//             onLogout={handleLogout}
//           />
//         }
//       >
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/login" element={<Login onLogin={setUser} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<Profile user={user} />} />
//         <Route path="/favorites" element={<Favorites />} />
//         <Route path="/recipes/:id" element={<RecipeDetail />} />
//       </Route>
//     </Routes>
//     </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;

import { Routes, Route, BrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import RecipeDetail from "./pages/RecipeDetail";
import { AuthProvider } from "./context/AuthContext";
import About from "./components/About";
import Categories from "./pages/CategoryPage";
import ContactUs from "./components/ContactUs";
function App() {
  // УДАЛЯЕМ useState, useEffect и функции logout/getStatus отсюда.
  // Всё это теперь живет внутри AuthProvider.

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* У RootLayout убираем все пропсы, они ему больше не нужны */}
          <Route element={<RootLayout />}>
            
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            {/* Убираем onLogin={setUser}, Логин сам обновит контекст */}
            <Route path="/login" element={<Login />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
            {/* У Profile тоже можно убрать проп user, если переписать Profile на useAuth */}
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



