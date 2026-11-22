import { useEffect, useRef, useState } from "react";

// 3D tilt + moving glare that follows the pointer (returns ref + handlers)
export function useTilt(max = 10) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

// element is pulled slightly toward the cursor
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

// counts up to `to` once the element is on screen
export function useCountUp(to, duration = 1400) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return [ref, value];
}

// scrambles characters into the final text
export function useScramble(text, { delay = 300, speed = 38 } = {}) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    const chars = "!<>-_\\/[]{}—=+*^?#01";
    let frame = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame / 2);
        setOut(
          text
            .split("")
            .map((c, i) => (c === " " ? " " : i < reveal ? c : chars[Math.floor(Math.random() * chars.length)]))
            .join("")
        );
        if (reveal >= text.length) clearInterval(timer);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, delay, speed]);
  return out || text.replace(/\S/g, " ");
}

// cycles through roles with typing / deleting
export function useTyper(words = [], { type = 70, erase = 35, hold = 1600 } = {}) {
  const [text, setText] = useState("");
  const key = words.join("|");
  useEffect(() => {
    if (!words.length) return;
    let w = 0, i = 0, deleting = false, t;
    const step = () => {
      const word = words[w % words.length];
      if (!deleting) {
        i++;
        setText(word.slice(0, i));
        if (i === word.length) { deleting = true; t = setTimeout(step, hold); return; }
        t = setTimeout(step, type);
      } else {
        i--;
        setText(word.slice(0, i));
        if (i === 0) { deleting = false; w++; t = setTimeout(step, 350); return; }
        t = setTimeout(step, erase);
      }
    };
    t = setTimeout(step, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, type, erase, hold]);
  return text;
}

// which section is currently in the middle of the viewport
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || "home");
  const key = ids.join("|");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
