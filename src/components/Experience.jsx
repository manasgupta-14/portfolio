import React from "react";
import { motion } from "framer-motion";
import "../customCss/Experience.css";
import laptopImage from "../assets/Laptop_image.png";

function Experience() {
  const experiences = [
    {
      id: 1,
      date: "(Sept 2024 - Dec 2025)",
      title: "Full Stack Developer",
      company: "Personal & Academic Projects",
    },
    {
      id: 2,
      date: "(Jan 2025 - Mar 2025 · 8 Weeks)",
      title: "Web Development Intern",
      company: "Internshala Trainings (Virtual)",
    },
    {
      id: 3,
      date: "(Jan 2026 - Present)",
      title: "MERN + AI Training",
      company: "CETPA Infotech Pvt Ltd",
    },
    {
      id: 4,
      date: "(Jan 2022 - Present)",
      title: "Self Employed",
      company: "Code & build projects on a daily basis",
    },
  ];

  return (
    <>
    <section id="experience">
      <div className="container-fluid experience-section">
        <div className="row mb-4">
          <div className="col-12">
            <motion.div
              className="header mt-3 text-center"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span>Experience</span>

              <p className="experince-subtitle">
                My hands-on experience and professional learning journey.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="row align-items-center">
          <motion.div className="col-lg-6 col-md-6 col-12 scene-container mb-5 mb-md-0 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            <img
              src={laptopImage}
              alt="Developer working on laptop"
              className="img-fluid"
            />
          </motion.div>

          <motion.div className="col-lg-6 col-md-6 col-12"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}>
            <div className="timeline">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-content">
                    <div className="neon-border"></div>

                    <span className="date">{exp.date}</span>

                    <div className="content-body">
                      <div className="icon-container">
                        <i className="bi bi-briefcase-fill"></i>
                      </div>

                      <div className="text-container">
                        <h3 className="title">{exp.title}</h3>
                        <p className="company">{exp.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </section>
    </>
  );
}

export default Experience;
