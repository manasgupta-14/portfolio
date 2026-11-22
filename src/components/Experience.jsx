import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";
import { SectionHead } from "./Section";

export default function Experience({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });

  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionHead title="Experience" sub="My hands-on experience and professional learning journey." />
        <div className="tl" ref={ref}>
          <div className="tl-rail"><motion.div className="tl-fill" style={{ scaleY }} /></div>
          {items.map((e, i) => (
            <motion.div className="tl-item" key={e._id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.05 * (i % 2), ease: [0.22, 1, 0.36, 1] }}>
              <motion.span className="tl-node" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }} />
              <div className="glass tl-card">
                {e.period && <span className="tl-period">{e.period}</span>}
                <h3>{e.title}</h3>
                <div className="co"><FaBriefcase size={14} /> {e.company}</div>
                {e.description && <p className="desc">{e.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
