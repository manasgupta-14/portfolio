import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { SectionHead, stagger, rise } from "./Section";
import { useTilt } from "../lib/hooks";
import { assetUrl } from "../lib/api";

function Card({ p }) {
  const t = useTilt(7);
  const img = assetUrl(p.image);
  return (
    <motion.div variants={rise}>
      <article className="glass tilt proj-card" ref={t.ref} onMouseMove={t.onMouseMove} onMouseLeave={t.onMouseLeave}>
        <div className="proj-media">
          {img ? <img src={img} alt={p.title} loading="lazy" /> : <span className="big">{p.title.slice(0, 2)}</span>}
        </div>
        <div className="proj-body">
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          {p.technologies?.length > 0 && (
            <div className="chips">{p.technologies.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
          )}
          {(p.url || p.githubUrl) && (
            <div className="proj-links">
              {p.url && <a className="link-btn primary" href={p.url} target="_blank" rel="noreferrer"><FaExternalLinkAlt size={12} /> Live demo</a>}
              {p.githubUrl && <a className="link-btn" href={p.githubUrl} target="_blank" rel="noreferrer"><FaGithub /> Code</a>}
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export default function Projects({ items }) {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead title="Projects" sub="A showcase of my development projects and practical implementations." />
        <motion.div className="proj-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          {items.map((p) => <Card key={p._id} p={p} />)}
        </motion.div>
      </div>
    </section>
  );
}
