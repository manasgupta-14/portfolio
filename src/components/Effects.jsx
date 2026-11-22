import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring } from "framer-motion";

/* ---------- full-screen particle network that reacts to the pointer ---------- */
export function Background() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, dpr, parts = [], raf;
    const mouse = { x: -9999, y: -9999 };

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.floor((w * h) / 17000), 90);
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 150) { p.x += (dx / d) * 1.4; p.y += (dy / d) * 1.4; }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160, 175, 255, 0.75)";
        ctx.fill();
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(124, 92, 255, ${0.22 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 180) {
          ctx.strokeStyle = `rgba(45, 226, 200, ${0.5 * (1 - md / 180)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <canvas ref={ref} />
    </div>
  );
}

/* ---------- custom cursor (desktop only) ---------- */
export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.body.classList.add("has-cursor");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => setHover(!!e.target.closest?.("a, button, input, textarea, select, [role=button], .tilt"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!on) return null;
  return (
    <>
      <motion.div className={`cursor-ring ${hover ? "hover" : ""}`} style={{ x: rx, y: ry }} />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

/* ---------- intro loader ---------- */
export function Preloader({ ready, onDone, name = "Portfolio" }) {
  const [pct, setPct] = useState(0);
  const doneRef = useRef(false);
  const start = useRef(null);

  useEffect(() => {
    let raf;
    const tick = (now) => {
      if (start.current === null) start.current = now;
      const t = Math.min((now - start.current) / 1600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(() => {
        const target = ready ? 100 : 99;
        return Math.min(Math.round(eased * 100), target);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    if (pct >= 100 && !doneRef.current) {
      doneRef.current = true;
      setTimeout(onDone, 350);
    }
  }, [pct, onDone]);

  return (
    <motion.div className="preloader" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      initial={{ clipPath: "inset(0 0 0% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="preloader-inner">
        <div className="preloader-name" aria-label={name}>
          {name.split("").map((c, i) => (
            <motion.span key={i} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.5, ease: "easeOut" }}>
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </div>
        <div className="preloader-bar"><i style={{ width: `${pct}%` }} /></div>
        <div className="preloader-count">{String(pct).padStart(2, "0")}%</div>
      </div>
    </motion.div>
  );
}
