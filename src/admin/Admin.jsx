import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import { api, clearToken, getToken, setToken } from "../lib/api";
import CrudManager from "./CrudManager";
import ProfileEditor from "./ProfileEditor";
import Messages from "./Messages";
import { CONFIGS } from "./configs";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const { token } = await api.login({ email, password });
      setToken(token);
      onLogin();
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <h1>Admin login</h1>
        <p>Sign in to manage your portfolio content.</p>
        <div className="f-row"><label htmlFor="e">Email</label><input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></div>
        <div className="f-row"><label htmlFor="p">Password</label><input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></div>
        {err && <div className="a-notice err">{err}</div>}
        <button className="a-btn pri" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <Link to="/" style={{ color: "var(--muted)", fontSize: "0.88rem", textAlign: "center" }}>← Back to portfolio</Link>
      </form>
    </div>
  );
}

const TABS = [
  { id: "profile", label: "About & Profile", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "certifications", label: "Certifications", icon: "🏅" },
  { id: "messages", label: "Messages", icon: "✉️" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [tab, setTab] = useState("profile");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!getToken()) return setAuthed(false);
    api.me().then(() => setAuthed(true)).catch(() => { clearToken(); setAuthed(false); });
  }, []);

  const logout = useCallback(() => { clearToken(); setAuthed(false); }, []);

  if (authed === null) return <div style={{ padding: 40, color: "#8f9ab3" }}>Checking session...</div>;
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">Portfolio Admin</div>
        {TABS.map((t) => (
          <button key={t.id} className={`adm-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span> {t.label}
            {t.id === "messages" && unread > 0 && <span className="count">{unread}</span>}
          </button>
        ))}
        <div className="spacer" />
        <Link className="adm-tab" to="/">🌐 View site</Link>
        <button className="adm-tab" onClick={logout}>↩ Logout</button>
      </aside>
      <main className="adm-main">
        {tab === "profile" && <ProfileEditor onAuthError={logout} />}
        {tab === "messages" && <Messages onAuthError={logout} onCount={setUnread} />}
        {CONFIGS[tab] && <CrudManager key={tab} config={CONFIGS[tab]} onAuthError={logout} />}
      </main>
    </div>
  );
}
