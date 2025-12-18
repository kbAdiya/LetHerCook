// import RecipeSearch from "../components/RecipeSearch";
// import { useAuth } from "../context/AuthContext";
// function Home() {
//    const { user } = useAuth();
//   return  <div>
//       <h2>Welcome {user ? user.username : "Guest"}!</h2>
//       <p>This is the home page.</p>
//       <RecipeSearch />;
//     </div> 
// }

// export default Home;
import { Navigate } from "react-router-dom"; // Импорт редиректа
import RecipeSearch from "../components/RecipeSearch";
import { useAuth } from "../context/AuthContext";
import { useTranslate } from "../i18n/useTranslate";


function Home() {
  const { user } = useAuth();
  const { t } = useTranslate();


  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>{t("welcome")} {user.username}!</h2>
      <p>{t("homeDescription")}</p>
      <RecipeSearch />
    </div>
  );
}

export default Home;