import { useCallback, useEffect, useState } from "react";
import { api, assetUrl } from "../lib/api";
import { Field } from "./fields";

// Generic add / edit / delete screen driven by a config.
// config: { title, subtitle, endpoint, fields:[...], empty:{}, summary:(item)=>({title,sub}), toForm?, toApi? }
export default function CrudManager({ config, onAuthError }) {
  const { endpoint, fields } = config;
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | { id|null, data }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  const handle = useCallback((e) => {
    if (e.status === 401) onAuthError();
    else setError(e.message);
  }, [onAuthError]);

  const load = useCallback(() => {
    api.list(endpoint).then(setItems).catch(handle);
  }, [endpoint, handle]);
  useEffect(load, [load]);

  const toForm = (item) => {
    const d = {};
    for (const f of fields) {
      const v = item?.[f.name];
      d[f.name] = f.type === "tags" ? (v || []).join(", ") : v ?? config.empty?.[f.name] ?? "";
    }
    return d;
  };
  const toApi = (data) => {
    const out = {};
    for (const f of fields) {
      const v = data[f.name];
      out[f.name] = f.type === "tags" ? String(v || "").split(",").map((s) => s.trim()).filter(Boolean) : f.type === "number" ? (v === "" ? 0 : Number(v)) : v;
    }
    return out;
  };

  const openNew = () => { setError(""); setEditing({ id: null, data: toForm(null) }); };
  const openEdit = (item) => { setError(""); setEditing({ id: item._id, data: toForm(item) }); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const body = toApi(editing.data);
      if (editing.id) await api.update(endpoint, editing.id, body);
      else await api.create(endpoint, body);
      setEditing(null);
      setFlash(editing.id ? "Updated successfully" : "Added successfully");
      setTimeout(() => setFlash(""), 2500);
      load();
    } catch (ex) { handle(ex); } finally { setSaving(false); }
  };

  const del = async (item) => {
    const s = config.summary(item);
    if (!window.confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      await api.remove(endpoint, item._id);
      setFlash("Deleted");
      setTimeout(() => setFlash(""), 2500);
      load();
    } catch (ex) { handle(ex); }
  };

  return (
    <>
      <div className="adm-top">
        <div><h1>{config.title}</h1><p>{config.subtitle}</p></div>
        <button className="a-btn pri" onClick={openNew}>+ Add new</button>
      </div>

      {flash && <div className="a-notice ok" style={{ marginBottom: 14 }}>{flash}</div>}
      {error && !editing && <div className="a-notice err" style={{ marginBottom: 14 }}>{error}</div>}

      {items === null ? <p style={{ color: "var(--muted)" }}>Loading...</p> : items.length === 0 ? (
        <div className="a-empty">Nothing here yet. Click “Add new” to create the first entry.</div>
      ) : (
        <div className="list">
          {items.map((it) => {
            const s = config.summary(it);
            return (
              <div className="row" key={it._id}>
                {s.image && <img className="thumb" src={assetUrl(s.image)} alt="" />}
                <div className="body"><b>{s.title}</b>{s.sub && <span>{s.sub}</span>}</div>
                <div className="acts">
                  <button className="a-btn sm" onClick={() => openEdit(it)}>Edit</button>
                  <button className="a-btn sm danger" onClick={() => del(it)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && !saving && setEditing(null)}>
          <form className="modal-card" onSubmit={save}>
            <h2>{editing.id ? "Edit" : "Add"} {config.single}</h2>
            <div className="form-card" style={{ border: 0, padding: 0, background: "none" }}>
              {fields.map((f) => (
                <Field key={f.name} f={f} value={editing.data[f.name]} onChange={(v) => setEditing({ ...editing, data: { ...editing.data, [f.name]: v } })} />
              ))}
              {error && <div className="a-notice err">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="a-btn" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="a-btn pri" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
