// Simple API client wrapper
// Resolution priority:
// 1. VITE_API_BASE (explicit override via env)
// 2. Render deployment base (kidora-backend-a9fx.onrender.com) while custom domain not configured
// 3. Future production custom domain API (api.kidora.com.bd) when live
// 4. Local dev fallback
const explicit = import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.trim();
const PROD_RENDER = 'https://kidora-backend-production.up.railway.app';
// const PROD_CUSTOM = 'https://api.kidora.com.bd'; // move after render until DNS + backend mapping is active
// const LOCAL_DEFAULT = 'http://127.0.0.1:8000';

let API_BASE = explicit || PROD_RENDER || PROD_CUSTOM || LOCAL_DEFAULT; // updated ordering
// let API_BASE = LOCAL_DEFAULT
// Normalize: remove trailing slash for consistency
if (API_BASE.endsWith('/')) API_BASE = API_BASE.slice(0, -1);

function withQuery(url, params) {
  if (!params) return url;
  const usp = new URLSearchParams(params);
  return `${url}?${usp.toString()}`;
}

async function request(path, { method = 'GET', headers = {}, body, auth } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const finalHeaders = isFormData ? { ...headers } : { 'Content-Type': 'application/json', ...headers };
  if (auth?.bearer) finalHeaders['Authorization'] = `Bearer ${auth.bearer}`;
  if (auth?.basic) finalHeaders['Authorization'] = `Basic ${btoa(`${auth.basic.username}:${auth.basic.password}`)}`;

  const fetchBody = isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined);
  const res = await fetch(url, { method, headers: finalHeaders, body: fetchBody });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = data?.detail || data?.message || res.statusText;
    const err = new Error(msg);
    err.status = res.status; err.data = data; throw err;
  }
  return data;
}

export const apiClient = {
  base: API_BASE,
  request,
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  withQuery,
};
