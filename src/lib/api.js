const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

function authHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export { API_BASE_URL };
