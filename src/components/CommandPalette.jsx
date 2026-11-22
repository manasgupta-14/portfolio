import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaDownload, FaEnvelope, FaCopy, FaGithub, FaLinkedin, FaHashtag } from "react-icons/fa";
import { assetUrl } from "../lib/api";

const LABELS = {
  home: "Home", about: "About", education: "Education", experience: "Experience",
  skills: "Skills", projects: "Projects", certification: "Certificates", contact: "Contact",
};

/* Ctrl/Cmd + K (or "/") opens a searchable menu to jump to sections or run quick actions. */
export default function CommandPalette({ open, setOpen, ids, profile }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [note, setNote] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const items = useMemo(() => {
    const list = ids.map((id) => ({
      key: `go-${id}`, group: "Go to", label: LABELS[id], icon: <FaHashtag />,
      run: () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    }));
    if (profile.resumeUrl) list.push({ key: "cv", group: "Actions", label: "Download CV", icon: <FaDownload />,
      run: () => { const a = document.createElement("a"); a.href = assetUrl(profile.resumeUrl); a.download = ""; a.click(); } });
    if (profile.email) {
      list.push({ key: "mail", group: "Actions", label: "Send an email", icon: <FaEnvelope />, run: () => window.location.assign(`mailto:${profile.email}`) });
      list.push({ key: "copy", group: "Actions", label: "Copy email address", icon: <FaCopy />, keep: true,
        run: async () => {
          try { await navigator.clipboard.writeText(profile.email); setNote("Email copied"); }
          catch { setNote(profile.email); }
        } });
    }
    if (profile.github) list.push({ key: "gh", group: "Links", label: "Open GitHub", icon: <FaGithub />, run: () => window.open(profile.github, "_blank", "noopener") });
    if (profile.linkedin) list.push({ key: "in", group: "Links", label: "Open LinkedIn", icon: <FaLinkedin />, run: () => window.open(profile.linkedin, "_blank", "noopener") });
    return list;
  }, [ids, profile]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => i.label.toLowerCase().includes(t) || i.group.toLowerCase().includes(t)) : items;
  }, [items, q]);

  // global shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(e.target?.tagName || "") || e.target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) { setQ(""); setIdx(0); setNote(""); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);
  useEffect(() => { setIdx(0); }, [q]);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  const run = (item) => {
    if (!item) return;
    if (!item.keep) setOpen(false);
    setTimeout(item.run, item.keep ? 0 : 160);
  };
  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => (shown.length ? (i + 1) % shown.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => (shown.length ? (i - 1 + shown.length) % shown.length : 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(shown[idx]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const rows = shown.map((it, i) => ({ it, i, head: i === 0 || shown[i - 1].group !== it.group ? it.group : null }));
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmd-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <motion.div className="cmd" role="dialog" aria-modal="true" aria-label="Command menu"
            initial={{ opacity: 0, y: -18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}>
            <div className="cmd-input">
              <FaSearch aria-hidden="true" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey}
                placeholder="Jump to a section or run an action" aria-label="Search commands"
                role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={shown[idx] ? `cmd-${shown[idx].key}` : undefined} />
              <kbd>Esc</kbd>
            </div>
            <div className="cmd-list" id="cmd-list" role="listbox" ref={listRef}>
              {shown.length === 0 && <p className="cmd-empty">Nothing matches “{q}”. Try “projects” or “email”.</p>}
              {rows.map(({ it, i, head }) => {
                return (
                  <div key={it.key}>
                    {head && <p className="cmd-group">{head}</p>}
                    <button id={`cmd-${it.key}`} role="option" aria-selected={i === idx} className={`cmd-item ${i === idx ? "on" : ""}`}
                      onMouseMove={() => setIdx(i)} onClick={() => run(it)}>
                      {i === idx && <motion.span layoutId="cmd-hl" className="cmd-hl" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                      <span className="cmd-ic">{it.icon}</span>
                      <span>{it.label}</span>
                      {i === idx && <kbd>Enter</kbd>}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="cmd-foot" aria-live="polite">
              {note ? <b>{note}</b> : <span><kbd>↑</kbd><kbd>↓</kbd> move <kbd>Enter</kbd> select</span>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
