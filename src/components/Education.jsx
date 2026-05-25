import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import "../customCss/Education.css";

function Education() {
  const cards = [
    {
      id: 1,
      year: "2022 - 2025",
      course: "Bachelor of Computer Application (BCA)",
      college: "JS University",
      address: "Shikhobad, Uttar Pradesh",
      status: "Complete",
      percent: "73%",
    },
    {
      id: 2,
      year: "2021",
      course: "Intermediate",
      college: "B I C BHELUR CHANGERI MAU",
      address: "Mau, Uttar Pradesh",
      status: "Complete",
      percent: "73%",
    },
    {
      id: 3,
      year: "2019",
      course: "High School",
      college: "Y S Y S I C SAMAYATHAN BHITI",
      address: "Gorakhpur, Uttar Pradesh",
      status: "Complete",
      percent: "77%",
    },
    // {
    //   id: 4,
    //   year: "2017",
    //   course: "Middle School",
    //   college: "Y S Y S I C SAMAYATHAN BHITI",
    //   address: "Gorakhpur, Uttar Pradesh",
    //   status: "Complete",
    //   percent: "77%",
    // },
  ];

  return (
    <section className="education-section" id="education">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <motion.h2
              className="education-heading"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span>Education</span>
              
            <p className="education-subtitle">
              My academic background and learning journey.
            </p>
            </motion.h2>
          </div>
        </div>

        <div className="row g-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="col-12 col-md-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="education-card">
                <div className="education-icon">
                  <GraduationCap size={26} />
                </div>

                <span className="education-year">{card.year}</span>
                <h3 className="education-title">{card.course}</h3>

                <p className="education-text">
                  <strong>College:</strong> {card.college}
                </p>
                <p className="education-text">
                  <strong>Location:</strong> {card.address}
                </p>

                <div className="education-footer">
                  <span className="education-status">
                    <Award size={16} />
                    {card.status}
                  </span>
                  <span className="education-percent">{card.percent}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
