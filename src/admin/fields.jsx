import { useState } from "react";
import { api, assetUrl } from "../lib/api";

export function ImageField({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setErr("Image must be under 5 MB");
    setBusy(true); setErr("");
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="f-row">
      <label>{label}</label>
      <div className="img-up">
        {value ? <img src={assetUrl(value)} alt="" /> : <div className="none">No image</div>}
        <div style={{ display: "grid", gap: 8 }}>
          <label className="a-btn sm" style={{ cursor: "pointer" }}>
            {busy ? "Uploading..." : value ? "Change image" : "Choose image"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} hidden disabled={busy} />
          </label>
          {value && <button type="button" className="a-btn sm danger" onClick={() => onChange("")}>Remove</button>}
        </div>
      </div>
      {hint && <small>{hint}</small>}
      {err && <div className="a-notice err">{err}</div>}
    </div>
  );
}

// renders a field from a config object: {name,label,type,options,required,hint,placeholder}
export function Field({ f, value, onChange }) {
  const id = `f-${f.name}`;
  if (f.type === "image") return <ImageField label={f.label} value={value} onChange={onChange} hint={f.hint} />;
  return (
    <div className="f-row">
      <label htmlFor={id}>{f.label}{f.required ? " *" : ""}</label>
      {f.type === "textarea" ? (
        <textarea id={id} rows={f.rows || 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />
      ) : f.type === "select" ? (
        <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {f.options.map((o) => (typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      ) : (
        <input id={id} type={f.type === "number" ? "number" : "text"} value={value ?? ""} min={f.min} max={f.max}
          onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
          placeholder={f.placeholder} required={f.required} />
      )}
      {f.hint && <small>{f.hint}</small>}
    </div>
  );
}
