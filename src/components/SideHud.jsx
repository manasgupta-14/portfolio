import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useActiveSection } from "../lib/hooks";

const LABELS = {
  home: "Home", about: "About", education: "Education", experience: "Experience",
  skills: "Skills", projects: "Projects", certification: "Certificates", contact: "Contact",
};

const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });

function Clock() {
  const [t, setT] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <time className="hud-clock">{t}<small>my time · IST</small></time>;
}

/* Fixed left rail (wide screens): section ticks, scroll depth and my local time. */
export default function SideHud({ ids }) {
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const [pct, setPct] = useState(0);
  useEffect(() => fill.on("change", (v) => setPct(Math.round(Math.min(Math.max(v, 0), 1) * 100))), [fill]);

  return (
    <aside className="hud" aria-label="Page position">
      <span className="hud-pct">{String(pct).padStart(2, "0")}<small>%</small></span>
      <div className="hud-rail">
        <motion.i className="hud-fill" style={{ scaleY: fill }} />
        <ul>
          {ids.map((id) => (
            <li key={id} className={active === id ? "on" : ""}>
              <button onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} aria-label={`Go to ${LABELS[id]}`} aria-current={active === id}>
                <span className="tick" />
                <span className="lbl">{LABELS[id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Clock />
    </aside>
  );
}
