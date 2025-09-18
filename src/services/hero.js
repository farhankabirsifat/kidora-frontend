import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/hero-banners';

function toFullUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiClient.base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function listHeroBanners() {
  // Public endpoint: GET /api/hero-banners/
  const data = await apiClient.get(`${base}/`);
  return data.map(b => ({ ...b, imageUrl: toFullUrl(b.imageUrl) }));
}

export async function createHeroBanner({ title, subtitle, linkUrl, imageFile, imageUrl }) {
  const basic = getBasicCreds();
  const fd = new FormData();
  if (title !== undefined) fd.append('title', title ?? '');
  if (subtitle !== undefined) fd.append('subtitle', subtitle ?? '');
  if (linkUrl !== undefined) fd.append('linkUrl', linkUrl ?? '');
  if (imageFile) fd.append('image', imageFile);
  if (imageUrl) fd.append('imageUrl', imageUrl);
  // POST /api/hero-banners/
  const created = await apiClient.post(`${base}/`, fd, { auth: { basic } });
  return { ...created, imageUrl: toFullUrl(created.imageUrl) };
}

export async function updateHeroBanner(id, { title, subtitle, linkUrl, imageFile, imageUrl }) {
  const basic = getBasicCreds();
  const fd = new FormData();
  if (title !== undefined) fd.append('title', title ?? '');
  if (subtitle !== undefined) fd.append('subtitle', subtitle ?? '');
  if (linkUrl !== undefined) fd.append('linkUrl', linkUrl ?? '');
  if (imageFile) fd.append('image', imageFile);
  if (imageUrl) fd.append('imageUrl', imageUrl);
  const updated = await apiClient.put(`${base}/${id}`, fd, { auth: { basic } });
  return { ...updated, imageUrl: toFullUrl(updated.imageUrl) };
}

export async function deleteHeroBanner(id) {
  const basic = getBasicCreds();
  return apiClient.del(`${base}/${id}`, { auth: { basic } });
}
