import "../customCss/Project.css";
import { motion } from "framer-motion";
import {
  Globe,
  School,
  Wrench,
  ExternalLink,
  UtensilsCrossed,
} from "lucide-react";

const projects = [
  {
    title: "Tourism Website",
    description:
      "A comprehensive tourism website featuring online repairing, attendance management system, and various web development projects.",
    url: "https://manasgupta-14.github.io/Mera-Safar---Safar-Aapka-Zimmedari-Hamari-/",
    icon: Globe,
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    title: "Restaurant Management System",
    description:
      "A modern restaurant website with menu, contact and responsive design.",
    url: "https://manasgupta-14.github.io/Restaurant-/",
    icon: UtensilsCrossed,
    technologies: ["HTML", "CSS"],
  },
  {
    title: "School Website",
    description:
      "School management website with attendance system and student records.",
    icon: School,
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
  },
  {
    title: "Appliance & Home Repair Services",
    description:
      "One-stop platform for AC, fan, mobile, and appliance repairing services.",
    icon: Wrench,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP"],
  },
];

function Projects() {
  return (
    <>
      <div className="container-fluid mt-5 mb-4" id="projects">
        <div className="row">
          <div className="col-12">
            <motion.div
              className="projects-heading-wrapper"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="projects-heading">
                <span className="projects-badge">PROJECTS</span>
              </div>

              <p className="projects-subtitle">
                A showcase of my development projects and practical
                implementations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row g-4">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div key={index} className="col-12 col-md-6">
                <motion.div
                  className="project-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="project-icon-box">
                    <Icon size={26} />
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  <div className="project-tech">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-box">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Projects;
