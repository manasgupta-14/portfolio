import { motion } from "framer-motion";

// Section title: words rise out of a mask, accent line draws in.
export function SectionHead({ title, sub }) {
  const words = title.split(" ");
  return (
    <div className="sec-head">
      <h2 className="sec-title" aria-label={title}>
        {words.map((w, i) => (
          <span className="w" key={i} aria-hidden="true">
            <motion.span initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
              {w}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.div className="sec-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
      {sub && (
        <motion.p className="sec-sub" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}>
          {sub}
        </motion.p>
      )}
    </div>
  );
}

export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
export const rise = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
