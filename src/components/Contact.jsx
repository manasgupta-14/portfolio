import React, { useState, useEffect } from "react";
import "../customCss/Contact.css";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaFacebook,
  FaGithub,
  FaStackOverflow,
  FaPaperPlane,
  FaArrowUp,
  FaYoutube, 
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Contact() {

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="contact-section" id="contact">
        <div className="container-fluid">
          <motion.div
            className="row mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="col-12">
              <h2 className="section-title mx-5">Get In Touch</h2>
            </div>
          </motion.div>

          <div className="row align-items-center mx-4">
            <motion.div
              className="col-lg-6 col-md-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="contact-card">
                <form className="contact-form">
                  <p className="form-description">
                    If you have any questions or concerns, please don't hesitate
                    to contact me. I am open to any work opportunities that
                    align with my skills and interests.
                  </p>

                  <div className="form-group mb-3">
                    <label className="form-label">Your Name:</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Your Email:</label>
                    <input
                      type="email"
                      className="form-control custom-input"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">Your Message:</label>
                    <textarea
                      className="form-control custom-input"
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="button" className="btn send-btn">
                    SEND MESSAGE <FaPaperPlane className="ms-2" />
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              className="col-lg-6 col-md-12 contact-info-section ps-lg-5"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="info-item">
                <div className="icon-circle">
                  <a href="mailto:manasmggupta@gmail.com">
                    <FaEnvelope />
                  </a>
                </div>
                <span className="info-text">
                  manasmggupta@gmail.com
                </span>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <a href="tel:9555998119">
                    <FaPhoneAlt />
                  </a>
                </div>
                <span className="info-text">
                  <a href="tel:9555998119">+91 9555998119</a>
                </span>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <FaMapMarkerAlt />
                </div>
                <span className="info-text">New Ashok Nagar, Delhi</span>
              </div>

              <motion.div
                className="social-icons-row mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <a href="https://github.com" target="_blank" className="social-circle">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/manas-gupta-97a4a4256/" target="_blank" className="social-circle">
                  <FaLinkedin />
                </a>
                <a href="https://www.youtube.com/@codingclutch_14" target="_blank" rel="noreferrer" className="social-circle">
                  <FaYoutube />
                </a>
                <a href="https://www.instagram.com/manas.__.nigam/" target="_blank" rel="noreferrer" className="social-circle">
                  <FaInstagram />
                </a>
                <a href="https://www.facebook.com/Manas1408" target="_blank" className="social-circle">
                  <FaFacebook />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="vertical-label"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>CONTACT</span>
        </motion.div>
        
        {showButton && (
          <div className="scroll-top-btn" onClick={scrollToTop}>
            <FaArrowUp />
          </div>
        )}
      </div>

      <div className="container-fluid footer-section">
        <div className="row">
          <div className="col-12">
            <div className="footer-line"></div>

            <div className="footer-content">
              <div className="footer-left">
                © Developer Portfolio by <span>Manas Gupta</span>
              </div>

              <div className="footer-right">
                <span>All rights reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
