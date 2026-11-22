import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Field } from "./fields";

const FIELDS = [
  { name: "photo", label: "Profile photo", type: "image", hint: "Shown in the About section" },
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "roles", label: "Roles (typing animation)", type: "text", hint: "Separate with commas: BCA Graduate, Web Developer, Programmer" },
  { name: "tagline", label: "Hero tagline", type: "textarea", rows: 3 },
  { name: "aboutParagraphs", label: "About me", type: "textarea", rows: 10, hint: "Leave a blank line between paragraphs" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "whatsapp", label: "WhatsApp number", type: "text", hint: "Contact-form messages open WhatsApp on this number. Country code + number, digits only (e.g. 919555998119)" },
  { name: "location", label: "Location", type: "text" },
  { name: "resumeUrl", label: "Resume link", type: "text", hint: "Default: /Manas_Gupta_Resume.pdf (file in frontend/public)" },
  { name: "github", label: "GitHub URL", type: "text" },
  { name: "linkedin", label: "LinkedIn URL", type: "text" },
  { name: "youtube", label: "YouTube URL", type: "text" },
  { name: "instagram", label: "Instagram URL", type: "text" },
  { name: "facebook", label: "Facebook URL", type: "text" },
];

export default function ProfileEditor({ onAuthError }) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.list("profile").then((p) => setData({
      ...p,
      roles: (p.roles || []).join(", "),
      aboutParagraphs: (p.aboutParagraphs || []).join("\n\n"),
    })).catch((e) => setMsg({ t: "err", s: e.message }));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const body = { ...data };
      delete body._id; delete body.__v; delete body.key; delete body.createdAt; delete body.updatedAt;
      body.roles = String(data.roles || "").split(",").map((s) => s.trim()).filter(Boolean);
      body.aboutParagraphs = String(data.aboutParagraphs || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
      await api.saveProfile(body);
      setMsg({ t: "ok", s: "Saved. Refresh the portfolio to see the changes." });
    } catch (ex) {
      if (ex.status === 401) onAuthError(); else setMsg({ t: "err", s: ex.message });
    } finally { setSaving(false); }
  };

  if (!data) return <p style={{ color: "var(--muted)" }}>{msg?.s || "Loading..."}</p>;

  return (
    <>
      <div className="adm-top"><div><h1>About &amp; Profile</h1><p>Your photo, intro, about text and contact details.</p></div></div>
      <form className="form-card" onSubmit={save}>
        {FIELDS.map((f) => <Field key={f.name} f={f} value={data[f.name]} onChange={(v) => setData({ ...data, [f.name]: v })} />)}
        {msg && <div className={`a-notice ${msg.t}`}>{msg.s}</div>}
        <div className="modal-actions"><button className="a-btn pri" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </>
  );
}
