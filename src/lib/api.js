const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "pf_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// images are stored as "/api/files/<id>" -> prefix with backend url when needed
export const assetUrl = (u) => (!u ? "" : /^(https?:|data:)/.test(u) ? u : u.startsWith("/api/") ? BASE + u : u);

async function request(path, { method = "GET", body, form, auth = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  portfolio: () => request("/api/portfolio"),
  contact: (body) => request("/api/contact", { method: "POST", body }),
  login: (body) => request("/api/auth/login", { method: "POST", body }),
  me: () => request("/api/auth/me", { auth: true }),
  list: (name) => request(`/api/${name}`),
  create: (name, body) => request(`/api/${name}`, { method: "POST", body, auth: true }),
  update: (name, id, body) => request(`/api/${name}/${id}`, { method: "PUT", body, auth: true }),
  remove: (name, id) => request(`/api/${name}/${id}`, { method: "DELETE", auth: true }),
  saveProfile: (body) => request("/api/profile", { method: "PUT", body, auth: true }),
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/upload", { method: "POST", form, auth: true });
  },
  messages: () => request("/api/messages", { auth: true }),
  markRead: (id) => request(`/api/messages/${id}/read`, { method: "PATCH", auth: true }),
  deleteMessage: (id) => request(`/api/messages/${id}`, { method: "DELETE", auth: true }),
};
