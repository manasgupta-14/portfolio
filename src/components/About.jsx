import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGraduationCap } from "react-icons/fa";
import { SectionHead, stagger, rise } from "./Section";
import { useTilt } from "../lib/hooks";
import { assetUrl } from "../lib/api";

export default function About({ profile, education }) {
  const tilt = useTilt(12);
  const paras = profile.aboutParagraphs?.filter(Boolean) || [];
  const photo = assetUrl(profile.photo);
  const latest = education?.[0];

  return (
    <section className="section" id="about">
      <div className="wrap">
        <SectionHead title="Who Am I?" />
        <div className="about-grid">
          <motion.div initial={{ opacity: 0, scale: 0.85, rotate: -6 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <div className="tilt about-photo" ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} style={{ borderRadius: "50%" }}>
              <div className="ring" />
              <div className="img">
                {photo ? <img src={photo} alt={profile.name || "Profile"} /> : <div className="empty">{(profile.name || "?")[0]}</div>}
              </div>
              <motion.div className="badge-float" animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                <span className="dot-live" /> Available for work
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="about-text" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            {paras.map((t, i) => <motion.p key={i} variants={rise}>{t}</motion.p>)}
            <motion.div className="about-facts" variants={rise}>
              {profile.location && <div className="fact glass"><FaMapMarkerAlt /> {profile.location}</div>}
              {profile.email && <div className="fact glass"><FaEnvelope /> {profile.email}</div>}
              {profile.phone && <div className="fact glass"><FaPhoneAlt /> {profile.phone}</div>}
              {latest && <div className="fact glass"><FaGraduationCap /> {latest.course}</div>}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
