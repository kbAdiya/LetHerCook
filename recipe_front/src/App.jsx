
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


  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
         
          <Route element={<RootLayout />}>
            
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
          
            <Route path="/login" element={<Login />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
           
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



