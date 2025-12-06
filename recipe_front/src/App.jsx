import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "./home"
import Favorites from "./Favorites"
import HomePage from "./HomePage"
import CategoryPage from "./CategoryPage"
import RecipePage from "./RecipePage"
import IngredientSearchPage from "./IngredientSearchPage"
import ApiTest from "./ApiTest"
import './App.css'

=======
import "./App.css";
import AboutPage from "./About"
>>>>>>> 177f009d82524a8d8cf2f5fd0243bbeedbc89bdc
function App() {


  return (
<<<<<<< HEAD
      <div>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* New recipe pages */}
        <Route path="/recipes" element={<HomePage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/ingredient-search" element={<IngredientSearchPage />} />
        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </Router>
=======
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
>>>>>>> 177f009d82524a8d8cf2f5fd0243bbeedbc89bdc
    </div>
  );
}

export default App;
