import React from "react";
import "../customCss/Skill.css";
import { motion } from "framer-motion";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaBootstrap,
  FaPhp,
  FaReact,
  FaGitAlt,
  FaDatabase,
  FaGithub,
} from "react-icons/fa";

import {
  SiTailwindcss,
  SiMysql,
  SiJquery,
  SiC,
  SiCplusplus,
} from "react-icons/si";

const skills = [
  { name: "HTML", icon: <FaHtml5 />, cssClass: "icon-html" },
  { name: "CSS", icon: <FaCss3Alt />, cssClass: "icon-css" },
  { name: "JavaScript", icon: <FaJs />, cssClass: "icon-js" },
  { name: "Bootstrap", icon: <FaBootstrap />, cssClass: "icon-bootstrap" },
  { name: "jQuery", icon: <SiJquery />, cssClass: "icon-jquery" },
  { name: "PHP", icon: <FaPhp />, cssClass: "icon-php" },
  { name: "MySQL", icon: <SiMysql />, cssClass: "icon-mysql" },
  { name: "React JS", icon: <FaReact />, cssClass: "icon-react" },
  { name: "Tailwind", icon: <SiTailwindcss />, cssClass: "icon-tailwind" },
  { name: "Git", icon: <FaGitAlt />, cssClass: "icon-git" },
  { name: "GitHub", icon: <FaGithub />, cssClass: "icon-git" },
];


const SkillsMarquee = () => {
  return (
    <>
      <hr className="custom-hr" />
      <div className="marquee-container" id="skills">
        <motion.div
          className="header-badge"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>Skills</span>
        </motion.div>

        <div className="marquee-wrapper">
          <motion.div
            className="marquee-track"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            {[...skills, ...skills].map((skill, index) => (
              <div key={index} className="skill-card">
                <div className={`skill-icon ${skill.cssClass}`}>
                  {skill.icon}
                </div>
                <p className="skill-name">{skill.name}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SkillsMarquee;
