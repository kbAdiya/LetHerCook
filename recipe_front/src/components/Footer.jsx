import logo from "../assets/logo.png";
import youtubeIcon from "../assets/icons/youtube.svg";
import twitterIcon from "../assets/icons/twitter.svg";
import instagramIcon from "../assets/icons/instagram.svg";
import pinterestIcon from "../assets/icons/pinterest.svg";
import "../styles/footer.css";
import { useTranslate } from "../i18n/useTranslate";


const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://youtube.com", icon: youtubeIcon },
  { label: "Twitter", href: "https://twitter.com", icon: twitterIcon },
  { label: "Instagram", href: "https://instagram.com", icon: instagramIcon },
  { label: "Pinterest", href: "https://pinterest.com", icon: pinterestIcon },
];

function Footer() {
  const { t } = useTranslate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt="LetHerCook logo" className="footer-logo" />
          <div>
            <div className="footer-brand-name">LetHerCook</div>
            <p className="footer-brand-copy">{t("footerDescription")}</p>
          </div>
        </div>

        <div className="footer-info">
          <div className="footer-section-title">{t("information")}:</div>
          <div className="footer-socials">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a key={label} href={href} className="footer-social" target="_blank" rel="noreferrer" aria-label={label}>
                <img src={icon} alt="" />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-contact">
          <div className="footer-section-title">{t("contact")}</div>
          <div className="footer-contact-detail">lethercook@gmail.com</div>
          <div className="footer-contact-detail">+7 777 123 4567</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

