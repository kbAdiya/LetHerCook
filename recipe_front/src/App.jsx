import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AboutPage from "./About"
function App() {


  return (
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
    </div>
  );
}

export default App;
