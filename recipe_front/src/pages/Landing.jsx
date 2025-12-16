import { Navigate } from "react-router-dom"; // 1. Импортируем Navigate
import { useAuth } from "../context/AuthContext"; // 2. Импортируем контекст
import RecipeSearch from "../components/RecipeSearch";

function Landing() {
  const { user } = useAuth();


  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <h1>You can find recipes for every taste</h1>
      <p>No account? Register now!</p>
  
      <RecipeSearch />
    </>
  );
}

export default Landing;