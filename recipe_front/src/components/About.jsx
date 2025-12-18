import { useNavigate } from "react-router-dom";

import "../styles/about.css";
import aboutimg from"../assets/image 1.png"
import { useTranslate } from "../i18n/useTranslate";


function About() {
const { t } = useTranslate();


  return (
    <div className="about-page">
    
      <main className="about-main">
        <section className="about-hero">
          <div className="about-copy">
            
            <h1 className="about-title">{t("about")}</h1>
            <p className="about-description">
              {t("aboutDescription")}
            </p>
          </div>
          <div className="about-media">
            <img src={aboutimg} alt="Assorted ingredients and dishes on a table" className="about-image" />
          </div>
        </section>
      </main>

      
    </div>
  );
}

export default About;


