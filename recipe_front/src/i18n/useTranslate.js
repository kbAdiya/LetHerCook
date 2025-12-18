import translations from "./translations";
import { useLanguage } from "../context/LanguageContext";

export function useTranslate() {
  const { lang } = useLanguage();

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { t };
}
