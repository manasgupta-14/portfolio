import { useEffect, useRef, useState } from "react";
import { skillColor } from "../lib/icons";
import { prefersReducedMotion } from "../lib/hooks";

const FALLBACK = ["HTML", "CSS", "JavaScript", "React", "Node", "MongoDB", "Express", "Git"].map((name, i) => ({
  name, icon: "code", level: 80 + (i % 4) * 4,
}));

// evenly spread points on a unit sphere
function fibSphere(n, offset = 0) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5 + offset) / n) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const angleDiff = (a, b) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

/* Interactive 3D skill sphere: drag to rotate (with inertia), hover a node to read it,
   click a node to swing it to the front. Pure canvas 2D, no WebGL dependency. */
export default function Orbit3D({ skills }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [focus, setFocus] = useState(null); // { name, level, color }
  const list = skills?.length ? skills : FALLBACK;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();

    // ---- scene ----
    const skillPts = fibSphere(list.length).map((p, i) => ({
      ...p,
      skill: list[i],
      rgb: hexToRgb(skillColor(list[i].icon)),
    }));
    const deco = fibSphere(72, 0.5).map((p) => ({ ...p, skill: null, rgb: [150, 175, 255] }));
    const nodes = [...skillPts, ...deco];
    // mesh: each node linked to its two nearest neighbours
    const edges = [];
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      near.forEach((o) => {
        if (!edges.some(([x, y]) => (x === i && y === o.j) || (x === o.j && y === i))) edges.push([i, o.j]);
      });
    });
    // three great-circle rings
    const ring = (axis) =>
      Array.from({ length: 96 }, (_, k) => {
        const t = (k / 96) * Math.PI * 2;
        const c = Math.cos(t), s = Math.sin(t);
        return axis === 0 ? { x: c, y: s, z: 0 } : axis === 1 ? { x: c, y: 0, z: s } : { x: 0, y: c, z: s };
      });
    const rings = [ring(0), ring(1), ring(2)];

    // ---- state ----
    let w = 0, h = 0, dpr = 1, R = 0, raf = 0, visible = true;
    let yaw = 0.6, pitch = 0.35;
    let vYaw = 0, vPitch = 0;
    let target = null; // { yaw, pitch } when a node is clicked
    let dragging = false, last = { x: 0, y: 0 }, moved = 0;
    const pointer = { x: -999, y: -999, inside: false };
    let hoverIdx = -1;
    let pinnedIdx = -1;
    let lastKey = -2;
    const CAM = 3.4;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth; h = wrap.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * 0.36;
    };

    const rot = (p, cy, sy, cx, sx) => {
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      return { x: x1, y: y2, z: z2 };
    };
    const proj = (p) => {
      const s = CAM / (CAM - p.z);
      return { sx: w / 2 + p.x * R * s, sy: h / 2 + p.y * R * s, s };
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // motion
      if (!reduce) {
        if (target && !dragging) {
          yaw += angleDiff(yaw, target.yaw) * 0.09;
          pitch += (target.pitch - pitch) * 0.09;
          if (Math.abs(angleDiff(yaw, target.yaw)) < 0.003 && Math.abs(target.pitch - pitch) < 0.003) target = null;
        } else if (!dragging) {
          yaw += vYaw;
          pitch += vPitch;
          vYaw *= 0.95; vPitch *= 0.95;
          const idle = pointer.inside ? 0.0012 : 0.0032;
          yaw += idle;
          pitch += (0.3 - pitch) * 0.012;
        }
      }
      pitch = Math.max(-1.25, Math.min(1.25, pitch));

      const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      ctx.clearRect(0, 0, w, h);

      // core glow
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R * 1.25);
      g.addColorStop(0, "rgba(54,230,255,0.16)");
      g.addColorStop(0.55, "rgba(106,99,255,0.07)");
      g.addColorStop(1, "rgba(106,99,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // rings
      rings.forEach((pts, ri) => {
        let prev = null;
        pts.forEach((p, k) => {
          const r = rot(p, cy, sy, cx, sx);
          const q = proj(r);
          if (prev) {
            const depth = (r.z + 1) / 2;
            ctx.strokeStyle = `rgba(${ri === 1 ? "54,230,255" : "130,125,255"},${0.05 + depth * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(prev.sx, prev.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
          }
          prev = q;
          if (k === pts.length - 1) {
            const f = proj(rot(pts[0], cy, sy, cx, sx));
            ctx.beginPath(); ctx.moveTo(q.sx, q.sy); ctx.lineTo(f.sx, f.sy); ctx.stroke();
          }
        });
      });

      // transform nodes
      const T = nodes.map((n) => {
        const r = rot(n, cy, sy, cx, sx);
        return { ...proj(r), z: r.z };
      });

      // mesh edges
      edges.forEach(([i, j]) => {
        const a = T[i], b = T[j];
        const depth = (a.z + b.z + 2) / 4;
        ctx.strokeStyle = `rgba(120,160,255,${0.04 + depth * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      });

      // hover test (front-most skill node under the pointer)
      let best = -1, bestZ = -2;
      if (pointer.inside && !dragging) {
        for (let i = 0; i < skillPts.length; i++) {
          const t = T[i];
          if (t.z < -0.15) continue;
          if (Math.hypot(t.sx - pointer.x, t.sy - pointer.y) < 22 * t.s && t.z > bestZ) { best = i; bestZ = t.z; }
        }
      }
      if (best !== hoverIdx) {
        hoverIdx = best;
        canvas.style.cursor = best >= 0 ? "pointer" : dragging ? "grabbing" : "grab";
      }

      // draw back-to-front
      const order = T.map((t, i) => i).sort((a, b) => T[a].z - T[b].z);
      order.forEach((i) => {
        const t = T[i], n = nodes[i];
        const depth = (t.z + 1) / 2;
        const [r, gg, b] = n.rgb;
        if (!n.skill) {
          ctx.fillStyle = `rgba(${r},${gg},${b},${0.15 + depth * 0.5})`;
          ctx.beginPath(); ctx.arc(t.sx, t.sy, 1 + depth * 1.4, 0, Math.PI * 2); ctx.fill();
          return;
        }
        const hot = i === hoverIdx || i === pinnedIdx;
        const rad = (hot ? 9 : 6.5) * t.s;
        const halo = ctx.createRadialGradient(t.sx, t.sy, 0, t.sx, t.sy, rad * 4);
        halo.addColorStop(0, `rgba(${r},${gg},${b},${(hot ? 0.55 : 0.32) * (0.4 + depth)})`);
        halo.addColorStop(1, `rgba(${r},${gg},${b},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(t.sx, t.sy, rad * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${r},${gg},${b},${0.45 + depth * 0.55})`;
        ctx.beginPath(); ctx.arc(t.sx, t.sy, rad, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${0.3 + depth * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(t.sx, t.sy, rad + 3, 0, Math.PI * 2); ctx.stroke();
        if (t.z > -0.2) {
          ctx.font = `${hot ? 700 : 600} ${Math.round(11 + 3 * t.s)}px Sora, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(235,242,255,${Math.min(1, 0.25 + depth * 1.1)})`;
          ctx.fillText(n.skill.name, t.sx, t.sy - rad - 9);
        }
      });

      // readout (React state only when it changes)
      const idx = hoverIdx >= 0 ? hoverIdx : pinnedIdx;
      if (idx !== lastKey) {
        lastKey = idx;
        if (idx >= 0) {
          const sk = skillPts[idx].skill;
          setFocus({ name: sk.name, level: sk.level ?? 80, color: skillColor(sk.icon) });
        } else {
          setFocus(null);
        }
      }
    };

    // ---- input ----
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e) => {
      dragging = true; moved = 0; target = null;
      last = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      const p = local(e);
      pointer.x = p.x; pointer.y = p.y; pointer.inside = true;
      if (!dragging) return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.0085; pitch += dy * 0.0085;
      vYaw = dx * 0.0085; vPitch = dy * 0.0085;
    };
    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (moved < 5) {
        // treat as click: swing the node under the pointer to the front
        const p = local(e);
        const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
        let hit = -1, hz = -2;
        skillPts.forEach((n, i) => {
          const r = rot(n, cy, sy, cx, sx);
          const q = proj(r);
          if (r.z > -0.15 && Math.hypot(q.sx - p.x, q.sy - p.y) < 24 * q.s && r.z > hz) { hit = i; hz = r.z; }
        });
        if (hit >= 0) {
          const n = skillPts[hit];
          target = { yaw: Math.atan2(-n.x, n.z), pitch: Math.atan2(n.y, Math.hypot(n.x, n.z)) };
          pinnedIdx = hit;
        } else {
          pinnedIdx = -1;
        }
      }
    };
    const onLeave = () => { pointer.inside = false; pointer.x = pointer.y = -999; };
    const onEnter = () => { pointer.inside = true; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(wrap);
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.style.cursor = "grab";
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerenter", onEnter);
    };
  }, [list]);

  return (
    <div className="orbit" ref={wrapRef}>
      <div className="orbit-rings" aria-hidden="true"><i /><i /><i /></div>
      <canvas ref={canvasRef} className="orbit-canvas" role="img" aria-label="Interactive 3D sphere of skills. Drag to rotate." />
      <span className="brk tl" /><span className="brk tr" /><span className="brk bl" /><span className="brk br" />
      <div className="orbit-readout" aria-live="polite">
        {focus ? (
          <>
            <b style={{ color: focus.color }}>{focus.name}</b>
            <span className="orbit-level"><i style={{ width: `${focus.level}%`, background: focus.color }} /></span>
            <em>{focus.level}%</em>
          </>
        ) : (
          <span className="orbit-hint">Drag to rotate · click a node</span>
        )}
      </div>
    </div>
  );
}
