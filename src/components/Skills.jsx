import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { SectionHead } from "./Section";
import { SkillIcon, skillColor } from "../lib/icons";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* ---------- marquee whose speed (and direction) follows the scroll velocity ---------- */
function Row({ items, base }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    let move = dir.current * base * (delta / 1000);
    const f = boost.get();
    if (f < -0.05) dir.current = -1;
    else if (f > 0.05) dir.current = 1;
    move += dir.current * Math.abs(move) * Math.abs(f);
    x.set(x.get() + move);
  });
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  const half = items.length < 6 ? [...items, ...items, ...items, ...items] : [...items, ...items];
  return (
    <div className="marquee" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <motion.div className="marquee-track" style={reduce ? undefined : { x: tx }}>
        {[...half, ...half].map((s, i) => (
          <div key={i} className="skill glass" style={{ "--c": skillColor(s.icon) }} aria-hidden={i >= half.length}>
            <div className="ico"><SkillIcon name={s.icon} size={38} /></div>
            <p>{s.name}</p>
            <div className="bar"><i style={{ width: `${s.level ?? 80}%` }} /></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- radar chart of the strongest skills ---------- */
const C = 200, RAD = 128;
const pt = (i, n, r) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / n;
  return [C + Math.cos(a) * r, C + Math.sin(a) * r];
};

function Level({ value }) {
  const mv = useMotionValue(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    const ctl = animate(mv, value, { duration: 0.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => ctl.stop();
  }, [value, mv]);
  return <>{n}</>;
}

function Radar({ items, sel, setSel }) {
  const n = items.length;
  const poly = items.map((s, i) => pt(i, n, ((s.level ?? 80) / 100) * RAD).join(",")).join(" ");
  const cur = sel >= 0 ? items[sel] : null;
  return (
    <svg className="radar" viewBox="0 0 400 400" role="img" aria-label="Radar chart of skill levels">
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={items.map((_, i) => pt(i, n, RAD * k).join(",")).join(" ")} className="r-ring" />
      ))}
      {items.map((_, i) => {
        const [x, y] = pt(i, n, RAD);
        return <line key={i} x1={C} y1={C} x2={x} y2={y} className="r-axis" />;
      })}
      <motion.polygon points={poly} className="r-shape"
        style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      {items.map((s, i) => {
        const [x, y] = pt(i, n, ((s.level ?? 80) / 100) * RAD);
        const [lx, ly] = pt(i, n, RAD + 30);
        const on = i === sel;
        const anchor = Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end";
        return (
          <g key={s.name + i} className={`r-node ${on ? "on" : ""}`} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
            <circle cx={x} cy={y} r={on ? 7 : 4.5} fill={skillColor(s.icon)} className="r-dot" />
            <circle cx={x} cy={y} r="18" fill="transparent" />
            <text x={lx} y={ly + 4} textAnchor={anchor} className="r-label">{s.name}</text>
          </g>
        );
      })}
      <text x={C} y={C - 4} textAnchor="middle" className="r-center-big">{cur ? <Level value={cur.level ?? 80} /> : ""}{cur ? "%" : ""}</text>
      <text x={C} y={C + 16} textAnchor="middle" className="r-center-sub">{cur ? cur.name : "Hover a point"}</text>
    </svg>
  );
}

export default function Skills({ items }) {
  const top = useMemo(() => [...items].sort((a, b) => (b.level ?? 80) - (a.level ?? 80)).slice(0, 8), [items]);
  const [sel, setSel] = useState(0);
  const mid = Math.ceil(items.length / 2);
  const a = items.slice(0, mid);
  const b = items.slice(mid);
  const avg = items.length ? Math.round(items.reduce((t, s) => t + (s.level ?? 80), 0) / items.length) : 0;
  const cur = top[sel];

  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead title="Skills" sub="Technologies and tools I use to build things for the web." />
        {top.length >= 3 && (
          <div className="skills-lab">
            <div className="glass radar-card"><Radar items={top} sel={sel} setSel={setSel} /></div>
            <div className="glass detail-card">
              {cur && (
                <>
                  <div className="detail-ico" style={{ "--c": skillColor(cur.icon) }}><SkillIcon name={cur.icon} size={44} /></div>
                  <h3>{cur.name}</h3>
                  <div className="detail-level"><b><Level value={cur.level ?? 80} /></b><span>/ 100</span></div>
                  <div className="detail-bar"><motion.i key={cur.name} initial={{ width: 0 }} animate={{ width: `${cur.level ?? 80}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ background: skillColor(cur.icon) }} /></div>
                  <p className="detail-meta">{items.length} technologies, average level {avg}%.</p>
                </>
              )}
              <div className="detail-chips" role="group" aria-label="Choose a skill">
                {top.map((s, i) => (
                  <button key={s.name + i} className={`chip pick ${i === sel ? "on" : ""}`} onClick={() => setSel(i)} aria-pressed={i === sel}>{s.name}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Row items={a} base={-1.5} />
      {b.length > 0 && <Row items={b} base={1.5} />}
    </section>
  );
}
