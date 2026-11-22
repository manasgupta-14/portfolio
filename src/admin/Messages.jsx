import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Messages({ onAuthError, onCount }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.messages().then((m) => { setItems(m); onCount?.(m.filter((x) => !x.read).length); })
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [onAuthError, onCount]);
  useEffect(load, [load]);

  const read = async (m) => { await api.markRead(m._id).catch(() => {}); load(); };
  const del = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    await api.deleteMessage(m._id).catch(() => {}); load();
  };

  return (
    <>
      <div className="adm-top"><div><h1>Messages</h1><p>Copies of messages visitors sent from the contact form.</p></div></div>
      {error && <div className="a-notice err">{error}</div>}
      {items === null ? <p style={{ color: "var(--muted)" }}>Loading...</p> : items.length === 0 ? (
        <div className="a-empty">No messages yet.</div>
      ) : (
        <div className="list">
          {items.map((m) => (
            <div className={`row ${m.read ? "" : "unread"}`} key={m._id} style={{ alignItems: "flex-start" }}>
              <div className="body" style={{ whiteSpace: "normal" }}>
                <b>{m.name} <a href={`mailto:${m.email}`} style={{ color: "var(--aqua)", fontWeight: 500, fontSize: "0.88rem" }}>&lt;{m.email}&gt;</a></b>
                <div className="msg-body">{m.message}</div>
                <div className="tags">
                  <span className="tag">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="acts" style={{ flexDirection: "column" }}>
                {!m.read && <button className="a-btn sm" onClick={() => read(m)}>Mark read</button>}
                <button className="a-btn sm danger" onClick={() => del(m)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
