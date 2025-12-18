import { Navigate } from "react-router-dom"; // 1. Импортируем Navigate
import { useAuth } from "../context/AuthContext"; // 2. Импортируем контекст
import RecipeSearch from "../components/RecipeSearch";
import { useTranslate } from "../i18n/useTranslate";

function Landing() {
  const { user } = useAuth();
  const { t } = useTranslate();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <h1>{t("landingTitle")}</h1>
      <p>{t("landingSubtitle")}</p>
  
      <RecipeSearch />
    </>
  );
}

export default Landing;