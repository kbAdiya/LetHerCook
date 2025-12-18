import React from "react";
import emailjs from "emailjs-com";
import "../styles/contact.css";
import { useTranslate } from "../i18n/useTranslate";

function ContactUs() {
  const { t } = useTranslate();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_q6r26nr",
      "template_93g2xg4",
      e.target,
      "5XIhfeX_v4iSlWNL2"
    )
    .then(
      () => {
        alert(t("messageSent"));
        e.target.reset();
      },
      (error) => {
        console.error(error);
        alert(t("messageFailed"));
      }
    );
  };

  return (
   <div className="contact-page">
      <div className="contact-card">

        {/* LEFT SIDE */}
        <div className="contact-left">
          <h3>{t("contactInfo")}</h3>
          <p>📞 +7 (777) 123 45 67</p>
          <p>✉️ lethercook@gmail.com</p>
          <p>📍 {t("location")}</p>
        </div>

        
        <div className="contact-right">
          <h1>{t("contact")}</h1>
          <p className="contact-subtitle">
            {t("contactSubtitle1")} <br />
            {t("contactSubtitle2")}
          </p>

          <form onSubmit={sendEmail} className="contact-form">
            <input
              type="text"
              name="from_name"
              placeholder={t("yourName")}
              required
            />

            <input
              type="email"
              name="from_email"
              placeholder={t("yourEmail")}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder={t("subject")}
              required
            />

            <textarea
              name="message"
              placeholder={t("yourMessage")}
              required
            />

            <button type="submit">{t("sendMessage")}</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
