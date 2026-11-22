import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaDownload, FaArrowRight } from "react-icons/fa";
import { useCountUp, useMagnetic, useScramble, useTyper } from "../lib/hooks";
import { assetUrl } from "../lib/api";
import Orbit3D from "./Orbit3D";

function Stat({ to, label }) {
  const [ref, v] = useCountUp(to);
  return (
    <div className="stat glass" ref={ref}>
      <b>{v}+</b>
      <span>{label}</span>
    </div>
  );
}

function Mag({ children, as: Tag = "a", className, ...rest }) {
  const m = useMagnetic(0.35);
  return <Tag ref={m.ref} onMouseMove={m.onMouseMove} onMouseLeave={m.onMouseLeave} className={className} {...rest}>{children}</Tag>;
}

export default function Hero({ data }) {
  const { profile, skills, projects, certifications, experience } = data;
  const name = profile.name || "Your Name";
  const scrambled = useScramble(name, { delay: 900 });
  const role = useTyper(profile.roles?.length ? profile.roles : ["Web Developer"]);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // the sphere drifts up and shrinks as the page scrolls away from the hero
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <motion.p className="hero-hello" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              &gt; hello_world, I am
            </motion.p>
            <h1 className="hero-name glitch" aria-label={name} data-text={scrambled}>{scrambled}</h1>
            <motion.div className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              {role}<span className="caret" />
            </motion.div>
            <motion.p className="hero-desc" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
              {profile.tagline}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              <Mag as="button" className="btn btn-fill" onClick={() => go("contact")}>Hire Me <FaArrowRight /></Mag>
              {profile.resumeUrl && (
                <Mag href={assetUrl(profile.resumeUrl)} download className="btn btn-line"><FaDownload /> Download CV</Mag>
              )}
            </motion.div>
            <motion.div className="hero-social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              {profile.email && <Mag href={`mailto:${profile.email}`} className="social-btn" aria-label="Email"><FaEnvelope /></Mag>}
              {profile.phone && <Mag href={`tel:${profile.phone.replace(/\s/g, "")}`} className="social-btn" aria-label="Phone"><FaPhoneAlt /></Mag>}
              {profile.github && <Mag href={profile.github} target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub"><FaGithub /></Mag>}
              {profile.linkedin && <Mag href={profile.linkedin} target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><FaLinkedin /></Mag>}
            </motion.div>
          </div>

          <motion.div className="orbit-stage" style={{ y, scale, opacity: fade }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              <Orbit3D skills={skills} />
              <motion.div className="float-chip a" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <span className="dot-live" /> Open to work
              </motion.div>
              <motion.div className="float-chip b" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                {"</>"} MERN + AI
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="stats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.7 }}>
          <Stat to={projects.length} label="Projects built" />
          <Stat to={skills.length} label="Technologies" />
          <Stat to={certifications.length} label="Certifications" />
          <Stat to={experience.length} label="Experience entries" />
        </motion.div>
      </div>
      <div className="scroll-cue" aria-hidden="true" />
    </section>
  );
}
