import React from "react";
import emailjs from "emailjs-com";
import "../styles/contact.css";

function ContactUs() {
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
        alert("Message sent successfully!");
        e.target.reset();
      },
      (error) => {
        console.error(error);
        alert("Failed to send message(");
      }
    );
  };

  return (
   <div className="contact-page">
      <div className="contact-card">

        {/* LEFT SIDE */}
        <div className="contact-left">
          <h3>Contact Information</h3>
          <p>📞 +7 (777) 123 45 67</p>
          <p>✉️ lethercook@gmail.com</p>
          <p>📍 Almaty, Kazakhstan</p>
        </div>

        
        <div className="contact-right">
          <h1>CONTACT US</h1>
          <p className="contact-subtitle">
            Questions or remarks? <br />
            Feel free to contact us anytime 💛
          </p>

          <form onSubmit={sendEmail} className="contact-form">
            <input
              type="text"
              name="from_name"
              placeholder="Your name"
              required
            />

            <input
              type="email"
              name="from_email"
              placeholder="Your email"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
            />

            <textarea
              name="message"
              placeholder="Your message"
              required
            />

            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
