import "../customCss/Certification.css";
import { Award, ExternalLink, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const certifications = [
  {
    title: "MERN + AI Training",
    platform: "CETPA Infotech Pvt Ltd",
    description:
      "I am pursuing MERN Stack and AI training from CETPA, where I am gaining practical knowledge of HTML, CSS, JavaScript, React, Node.js, MongoDB, and Artificial Intelligence for building modern web applications.",
    // verifyUrl:
    //   "https://trainings.internshala.com/verify-certificate/?certificate_number=aeb1tsunvga1",
    // certificateNumber: "aeb1sunvqa1",
    icon: "💻",
  },
  {
    title: "Web Development Training",
    platform: "Internshala",
    description:
      "Comprehensive online training covering modern web development technologies and best practices.",
    verifyUrl:
      "https://trainings.internshala.com/verify-certificate/?certificate_number=aeb1tsunvga1",
    certificateNumber: "aeb1sunvqa1",
    icon: "💻",
  },
  {
    title: "Internship & Job Preparation",
    platform: "Internshala",
    description:
      "Professional training focused on internship readiness, job preparation, and career development skills.",
    verifyUrl:
      "https://trainings.internshala.com/verify-certificate/?certificate_number=jbg97c5c09zlob",
    certificateNumber: "jbq97c5c09z",
    icon: "🎓",
  },
];

function Certification() {
  return (
    <>
      <motion.div className="container-fluid mt-5" id="certification"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
          <div className="row mt-4 text-center mt-5">
          <div className="header-certificate mt-4">
            <span>Certifications & Training</span>
          </div>
          <div className="describe mt-2">
            <p>Continuous learning and professional development</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="container-fluid mt-4"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}>
        <div className="row">
         {certifications.map((cert, index) => (
  <div
    className={`col-md-6 mb-4 ${
      certifications.length % 2 !== 0 &&
      index === certifications.length - 1
        ? "mx-auto"
        : ""
    }`}
    key={index}
  >
    <div className="card h-100 certification-card">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center gap-2">
          <motion.div
            className="floating-icon"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          >
            {cert.icon}
          </motion.div>

          <Award className="award-icon" />

          <p className="card-title">{cert.title}</p>
        </h5>

        <h6 className="card-platform">{cert.platform}</h6>

        <p className="card-text mt-4">{cert.description}</p>

        <div className="certificate-box">
          <span>Certificate Number</span>
          <strong className="card-certificatenumber">
            {cert.certificateNumber}
          </strong>
        </div>

        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="btn w-100 mt-3 d-flex justify-content-center align-items-center gap-2 verify-btn"
        >
          <ExternalLink size={16} />
          Verify Certificate
        </a>
      </div>
    </div>
  </div>
))}
        </div>
      </motion.div>

      <motion.div className="container-fluid mt-3"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}>
        <div className="row">
          <div className="col-12 card-in">
            <div className="card extra-card">
              <div className="header-certificate-extra">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <BookOpen className="custom-icon mx-3" />
                </motion.div>
                <span>Extra Curricular Activities</span>
              </div>
              <p className="extra-paragraph">
                Successfully completed online training in Web Development and Internship & Job Preparation via Internshala, gaining practical skills and staying aligned with current industry trends.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Certification;
