const API_BASE = "/api/v1";

export function getAuth() {
  const raw = localStorage.getItem("plateful_auth");
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(auth) {
  localStorage.setItem("plateful_auth", JSON.stringify(auth));
  window.dispatchEvent(new Event("plateful:auth"));
}

export function clearAuth() {
  localStorage.removeItem("plateful_auth");
  window.dispatchEvent(new Event("plateful:auth"));
}

export async function api(path, options = {}) {
  const auth = getAuth();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (response.status === 401) {
    clearAuth();
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
