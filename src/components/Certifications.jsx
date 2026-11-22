import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaAward, FaExternalLinkAlt, FaSearchPlus } from "react-icons/fa";
import { SectionHead, stagger, rise } from "./Section";
import { useTilt } from "../lib/hooks";
import { assetUrl } from "../lib/api";

function Card({ c, onOpen }) {
  const t = useTilt(7);
  const img = assetUrl(c.image);
  return (
    <motion.div variants={rise}>
      <article className="glass tilt cert-card" ref={t.ref} onMouseMove={t.onMouseMove} onMouseLeave={t.onMouseLeave}>
        {img ? (
          <button className="cert-thumb has-img" onClick={() => onOpen(c)} aria-label={`View ${c.title} certificate`}>
            <img src={img} alt={`${c.title} certificate`} loading="lazy" />
            <span className="zoom"><FaSearchPlus size={22} />View certificate</span>
          </button>
        ) : (
          <div className="cert-thumb"><div className="ph"><FaAward size={54} /></div></div>
        )}
        <div className="cert-body">
          <h3>{c.title}</h3>
          {c.platform && <span className="cert-plat">{c.platform}</span>}
          {c.description && <p>{c.description}</p>}
          {c.certificateNumber && <div className="cert-no"><span>Certificate no.</span><b>{c.certificateNumber}</b></div>}
          {c.verifyUrl && (
            <a className="link-btn" style={{ marginTop: 10, alignSelf: "flex-start" }} href={c.verifyUrl} target="_blank" rel="noreferrer">
              <FaExternalLinkAlt size={12} /> Verify certificate
            </a>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export default function Certifications({ items }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  return (
    <section className="section" id="certification">
      <div className="wrap">
        <SectionHead title="Certifications & Training" sub="Continuous learning and professional development." />
        <motion.div className="cert-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          {items.map((c) => <Card key={c._id} c={c} onOpen={setOpen} />)}
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className="lightbox-card" initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
              <img src={assetUrl(open.image)} alt={`${open.title} certificate`} />
              <div className="lightbox-cap"><b>{open.title}</b><span>{open.platform}</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
