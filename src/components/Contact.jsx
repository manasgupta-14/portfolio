import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedin, FaGithub, FaYoutube, FaInstagram,
  FaFacebook, FaWhatsapp, FaCheckCircle, FaExclamationCircle,
} from "react-icons/fa";
import { SectionHead } from "./Section";
import { useMagnetic, useTilt } from "../lib/hooks";
import { api } from "../lib/api";

function Social({ href, label, children }) {
  const m = useMagnetic(0.4);
  if (!href) return null;
  return <a ref={m.ref} onMouseMove={m.onMouseMove} onMouseLeave={m.onMouseLeave} className="social-btn" href={href} target="_blank" rel="noreferrer" aria-label={label}>{children}</a>;
}

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const tilt = useTilt(4);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // WhatsApp number: admin "WhatsApp" field, otherwise the phone number (10 digits -> India +91)
  const waNumber = (() => {
    const d = (profile.whatsapp || profile.phone || "").replace(/\D/g, "");
    return d.length === 10 ? "91" + d : d;
  })();

  const submit = (e) => {
    e.preventDefault();
    if (form.website) return; // bot
    if (!waNumber) {
      setStatus({ type: "err", text: "WhatsApp number is not set yet. Please use the email or phone shown here." });
      return;
    }
    const text = `Hello ${(profile.name || "").split(" ")[0]}, I am ${form.name.trim()}.\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`;
    // must open synchronously inside the click so the browser does not block the popup
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    api.contact({ name: form.name, email: form.email, message: form.message }).catch(() => {}); // keep a copy in admin inbox
    setStatus({ type: "ok", text: "WhatsApp opened with your message. Just press Send there to deliver it." });
    setForm({ name: "", email: "", message: "", website: "" });
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <SectionHead title="Get In Touch" sub="Have a question or a work opportunity? Send a message and I will reply as soon as I can." />
        <div className="contact-grid">
          <motion.form className="glass form tilt" ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} onSubmit={submit}
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="field"><input id="c-name" placeholder=" " value={form.name} onChange={set("name")} required maxLength={120} autoComplete="name" /><label htmlFor="c-name">Your name</label></div>
            <div className="field"><input id="c-email" type="email" placeholder=" " value={form.email} onChange={set("email")} required maxLength={200} autoComplete="email" /><label htmlFor="c-email">Your email</label></div>
            <div className="field"><textarea id="c-msg" rows={5} placeholder=" " value={form.message} onChange={set("message")} required maxLength={4000} /><label htmlFor="c-msg">Your message</label></div>
            <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set("website")} />
            {status.type === "ok" && <motion.div className="notice ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status"><FaCheckCircle style={{ marginTop: 3 }} /> {status.text}</motion.div>}
            {status.type === "err" && <motion.div className="notice err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="alert"><FaExclamationCircle style={{ marginTop: 3 }} /> {status.text}</motion.div>}
            <button className="btn btn-fill" type="submit">
              Send message <FaWhatsapp size={18} />
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="info-list">
              {profile.email && <a className="glass info" href={`mailto:${profile.email}`}><span className="ic"><FaEnvelope /></span><div><small>Email</small><span>{profile.email}</span></div></a>}
              {profile.phone && <a className="glass info" href={`tel:${profile.phone.replace(/\s/g, "")}`}><span className="ic"><FaPhoneAlt /></span><div><small>Phone</small><span>{profile.phone}</span></div></a>}
              {profile.location && <div className="glass info"><span className="ic"><FaMapMarkerAlt /></span><div><small>Location</small><span>{profile.location}</span></div></div>}
            </div>
            <div className="contact-social">
              <Social href={profile.github} label="GitHub"><FaGithub /></Social>
              <Social href={profile.linkedin} label="LinkedIn"><FaLinkedin /></Social>
              <Social href={profile.youtube} label="YouTube"><FaYoutube /></Social>
              <Social href={profile.instagram} label="Instagram"><FaInstagram /></Social>
              <Social href={profile.facebook} label="Facebook"><FaFacebook /></Social>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
