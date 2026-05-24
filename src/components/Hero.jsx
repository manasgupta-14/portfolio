import { motion } from "framer-motion";
import "../customCss/Hero.css";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h4 className="mt-5">Hello, I am</h4>

        <h1>Manas Gupta</h1>

        <h3>BCA Graduate | Web Developer | Programmer</h3>

        <p className="mt-3 hero-desc">
          Passionate about creating innovative web solutions with a strong
          foundation in programming and development.
        </p>

        <div className="hero-buttons text-center">
          <button className="btn-primary-hire">Hire Me</button>
          <button className="btn-outline" onClick={downloadCV}>
            Download CV </button>
        </div>

        <motion.div
          className="social-links"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:manasmggupta@gmail.com"
            className="social-icon"
          >
            <Mail size={20} />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="tel:9555998119"
            className="social-icon"
          >
            <Phone size={20} />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Github size={20} />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.linkedin.com/in/manas-gupta-97a4a4256/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Linkedin size={20} />
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-card mt-5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="code-window">
          <div className="window-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <pre className="code">
            <span className="pink">const</span>{" "}
            <span className="blue">coder</span> = &#123;
            {"\n"} name: <span className="infoText">'Manas Gupta'</span>,{"\n"}{" "}
            skills: [<span className="infoText">'HTML'</span>,
            <span className="infoText">'CSS'</span>,
            <span className="infoText">'JavaScript'</span>,
            <span className="infoText">'Bootstrap'</span>,
            <span className="infoText">'jQuery'</span>,
            <span className="infoText">'PHP'</span>,
            <span className="infoText">'MySQL'</span>,{"\n"}
            <span className="infoText">'React'</span>
            ],
            {"\n"} hardWorker: <span className="orange">true</span>,{"\n"}{" "}
            quickLearner: <span className="orange">true</span>,{"\n"}{" "}
            problemSolver: <span className="orange">true</span>,{"\n"} hireable:{" "}
            <span className="pink">function</span>() &#123;
            {"\n"} <span className="pink">return</span> ({"\n"}{" "}
            <span className="blue">this</span>.hardWorker &&
            {"\n"} <span className="blue">this</span>.problemSolver
            {"\n"} );
            {"\n"} &#125;
            {"\n"}&#125;;
          </pre>
        </div>
      </motion.div>
    </section>
  );
}
const downloadCV = () => {
  const link = document.createElement("a");
  link.href = "./Manas_Gupta_Resume.pdf";
  link.download = "Manas_Gupta_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default Hero;
