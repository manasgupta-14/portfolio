import "../customCss/About.css";
import profileImage from "../assets/Profile-Image.jpg";
import { motion } from "framer-motion";

function About() {
  return (
    <section className="about-section" id="about">
      <div className="container-fluid about-container">
        <div className="row align-items-center">
          <motion.div className="col-12 col-md-6 about-content"
           initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}>
            <h3 className="about-title">Who Am I?</h3>

            <p className="about-text">
              My name is Manas Gupta, and I am a dedicated and enthusiastic Web Developer as well as a BCA graduate with hands-on experience in{" "}
              <b
                style={{
                  fontSize: "17px",
                  color: "#ffd000",
                  textShadow: "5px 3px 6px rgba(0,0,0,0.5)",
                }}
              >
                "HTML5, CSS3, JavaScript, Bootstrap, jQuery, PHP, React JS,
                MySQL, and SQL"
              </b>
              . I have a solid understanding of front-end development using JavaScript and React JS, and I am experienced in building dynamic, database-driven websites using PHP and MySQL. I enjoy working on real-world projects that help me improve my logic, coding skills, and problem-solving abilities.
            </p>

            <p className="about-text">
              Currently, I am pursuing MERN Stack + AI Training from CETPA Infotech Pvt. Ltd., where I am enhancing my skills in modern web development technologies, full-stack application development, and AI-based solutions.
            </p>

            <p className="about-text">
              I am a quick learner, passionate about technology, and always eager to enhance my skills by learning new tools and frameworks. I am actively looking for job or internship opportunities where I can apply my knowledge, gain industry experience, and grow as a professional web developer.
            </p>
          </motion.div>

          <div className="col-12 col-md-6 mt-5 d-flex justify-content-center">
            <div className="hero-image">
              <div className="glow-circle"></div>
              <img src={profileImage} alt="Profile" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
