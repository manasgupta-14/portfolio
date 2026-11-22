import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LABELS = {
  home: "Home", about: "About", education: "Education", experience: "Experience",
  skills: "Skills", projects: "Projects", certification: "Certificates", contact: "Contact",
};

export default function Navbar({ ids, brand }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <nav className="nav" aria-label="Main">
        <div className="nav-pill">
          <button className="nav-logo" onClick={() => go("home")} aria-label="Go to top">{brand}</button>
          <ul className="nav-links">
            {ids.map((id) => (
              <li key={id}>
                <button className={`nav-link ${active === id ? "active" : ""}`} onClick={() => go(id)}>
                  {active === id && <motion.span layoutId="nav-bg" className="nav-bg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  {LABELS[id]}
                </button>
              </li>
            ))}
          </ul>
          <button className={`nav-burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <span />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="nav-drawer" initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.97 }} transition={{ duration: 0.2 }}>
            {ids.map((id) => (
              <button key={id} className={active === id ? "active" : ""} onClick={() => go(id)}>{LABELS[id]}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
