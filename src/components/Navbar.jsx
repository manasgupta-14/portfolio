import React, { useState, useEffect } from "react";
import "../customCss/Navbar.css";

function Navbar() {

  const [active, setActive] = useState("home");

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth"
      });
      setActive(id);

      const nav = document.getElementById("navMenu");
      if (nav.classList.contains("show")) {
        nav.classList.remove("show");
      }
    }
  };

  useEffect(() => {
    const sections = ["home", "about", "education", "experience","skills", "projects", "certification","contact"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          if (
            scrollPosition >= section.offsetTop &&
            scrollPosition < section.offsetTop + section.offsetHeight
          ) {
            setActive(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar custom-navbar navbar-expand-lg fixed-top">
      <div className="container">
        <span
          className="navbar-brand custom-logo"
          onClick={() => scrollToSection("home")}
        >
          Manas
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto custom-nav-links">

            <li className="nav-item">
              <button
                className={`nav-link ${active === "home" ? "active-link" : ""}`}
                onClick={() => scrollToSection("home")}
              >
                Home
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${active === "about" ? "active-link" : ""}`}
                onClick={() => scrollToSection("about")}
              >
                About
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${active === "education" ? "active-link" : ""}`}
                onClick={() => scrollToSection("education")}
              >
                Education
              </button>
            </li>

             <li className="nav-item">
              <button
                className={`nav-link ${active === "experience" ? "active-link" : ""}`}
                onClick={() => scrollToSection("experience")}
              >
                Experience
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${active === "skills" ? "active-link" : ""}`}
                onClick={() => scrollToSection("skills")}
              >
                Skills
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${active === "projects" ? "active-link" : ""}`}
                onClick={() => scrollToSection("projects")}
              >
                Projects
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${active === "certification" ? "active-link" : ""}`}
                onClick={() => scrollToSection("certification")}
              >
                Certification
              </button>
            </li>


            <li className="nav-item">
              <button
                className={`nav-link ${active === "contact" ? "active-link" : ""}`}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
