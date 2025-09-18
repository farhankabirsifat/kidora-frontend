import { apiClient } from './apiClient';

const TOKEN_KEY = 'kidora_token';
const USER_KEY = 'kidora_user';
const BASIC_KEY = 'kidora_basic';

export function saveToken(token) { localStorage.setItem(TOKEN_KEY, token || ''); }
export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user || null)); }
export function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
export function clearUser() { localStorage.removeItem(USER_KEY); }

export function saveBasicCreds(creds) { if (creds) localStorage.setItem(BASIC_KEY, btoa(`${creds.username}:${creds.password}`)); }
export function getBasicCreds() { const s = localStorage.getItem(BASIC_KEY); if (!s) return null; const [username, password] = atob(s).split(':'); return { username, password }; }
export function clearBasicCreds() { localStorage.removeItem(BASIC_KEY); }

export async function register(payload) {
  return apiClient.post('/api/auth/register', payload);
}

export async function login({ email, password }) {
  const data = await apiClient.post('/api/auth/login', { email, password });
  // Store bearer token for JWT endpoints
  if (data?.access_token) saveToken(data.access_token);
  // Save basic creds too for endpoints using HTTP Basic
  saveBasicCreds({ username: email, password });
  // Optionally fetch profile
  try {
    const profile = await getProfile();
    saveUser(profile);
  } catch {
    saveUser({ email });
  }
  return data;
}

export async function getProfile() {
  // user endpoints currently use HTTP Basic in backend security.get_current_user
  const basic = getBasicCreds();
  return apiClient.get('/api/user/me', { auth: { basic } });
}

export async function updateProfile(payload) {
  const basic = getBasicCreds();
  return apiClient.put('/api/user/me', payload, { auth: { basic } });
}

export async function changePassword({ currentPassword, newPassword }) {
  const basic = getBasicCreds();
  const res = await apiClient.put('/api/user/me/password', { currentPassword, newPassword }, { auth: { basic } });
  // Update stored basic creds to use the new password
  if (basic?.username) saveBasicCreds({ username: basic.username, password: newPassword });
  return res;
}

export async function logout() {
  const token = getToken();
  try { await apiClient.post('/api/auth/logout', {}, { auth: { bearer: token } }); } catch {}
  clearToken(); clearUser(); clearBasicCreds();
}

export function isAdminEmail(email) {
  return email === 'admin@example.com' || email?.endsWith('@admin');
}
