import { motion } from "framer-motion";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { SectionHead, stagger, rise } from "./Section";
import { useTilt } from "../lib/hooks";

function Ring({ percent }) {
  const n = parseFloat(percent);
  if (!percent || Number.isNaN(n)) return null;
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap" title={percent}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c5cff" /><stop offset="1" stopColor="#2de2c8" /></linearGradient></defs>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="5" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - Math.min(n, 100) / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }} />
      </svg>
      <b>{percent}</b>
    </div>
  );
}

function Card({ item }) {
  const t = useTilt(8);
  return (
    <motion.div variants={rise}>
      <div className="glass tilt edu-card" ref={t.ref} onMouseMove={t.onMouseMove} onMouseLeave={t.onMouseLeave}>
        <div className="edu-top">
          <FaGraduationCap size={26} color="#7c5cff" />
          {item.year && <span className="edu-year">{item.year}</span>}
        </div>
        <h3>{item.course}</h3>
        <p><b>College:</b> {item.college}</p>
        {item.address && <p><b>Location:</b> {item.address}</p>}
        <div className="edu-foot">
          <span className="edu-status"><FaCheckCircle /> {item.status}</span>
          <Ring percent={item.percent} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Education({ items }) {
  return (
    <section className="section" id="education">
      <div className="wrap">
        <SectionHead title="Education" sub="My academic background and learning journey." />
        <motion.div className="edu-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          {items.map((it) => <Card key={it._id} item={it} />)}
        </motion.div>
      </div>
    </section>
  );
}
