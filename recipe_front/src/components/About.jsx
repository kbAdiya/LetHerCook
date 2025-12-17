import { useNavigate } from "react-router-dom";

import "../styles/about.css";
import aboutimg from"../assets/image 1.png"

function About() {


  return (
    <div className="about-page">
     

      <main className="about-main">
        <section className="about-hero">
          <div className="about-copy">
            
            <h1 className="about-title">About us</h1>
            <p className="about-description">
              We&apos;re on a mission to make cooking easier and more accessible by helping you discover amazing recipes
              using the ingredients you already have at home. LetHerCook turns everyday pantry items into dishes you
              actually want to eat.
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


