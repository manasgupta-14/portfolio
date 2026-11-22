import { SectionHead } from "./Section";
import { SkillIcon, skillColor } from "../lib/icons";

function Row({ items, reverse }) {
  const list = items.length < 6 ? [...items, ...items, ...items, ...items] : [...items, ...items];
  // track is exactly two identical halves so the -50% translate loops seamlessly
  const half = list;
  return (
    <div className={`marquee ${reverse ? "rev" : ""}`}>
      <div className="marquee-track">
        {[...half, ...half].map((s, i) => (
          <div key={i} className="skill glass" style={{ "--c": skillColor(s.icon) }} aria-hidden={i >= half.length}>
            <div className="ico"><SkillIcon name={s.icon} size={38} /></div>
            <p>{s.name}</p>
            <div className="bar"><i style={{ width: `${s.level ?? 80}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills({ items }) {
  const mid = Math.ceil(items.length / 2);
  const a = items.slice(0, mid);
  const b = items.slice(mid);
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead title="Skills" sub="Technologies and tools I use to build things for the web." />
      </div>
      <Row items={a} />
      {b.length > 0 && <Row items={b} reverse />}
    </section>
  );
}
