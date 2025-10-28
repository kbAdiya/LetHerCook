import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, []);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
