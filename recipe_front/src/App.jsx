import { useState } from 'react'
import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home"
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
      </Routes>
    </Router>
    </div>

  )
}

export default App
