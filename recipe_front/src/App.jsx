import { useState } from 'react'
import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home"
import Favorites from "./Favorites"
import HomePage from "./HomePage"
import CategoryPage from "./CategoryPage"
import RecipePage from "./RecipePage"
import IngredientSearchPage from "./IngredientSearchPage"
import ApiTest from "./ApiTest"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
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
    </div>

  )
}

export default App
