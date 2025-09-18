import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/wishlist';

export async function getWishlist() {
  const basic = getBasicCreds();
  return apiClient.get(`${base}/`, { auth: { basic } });
}

export async function toggleWishlist(productId) {
  const basic = getBasicCreds();
  // POST uses productId as a query parameter
  return apiClient.post(`${base}/toggle?productId=${encodeURIComponent(productId)}`, null, { auth: { basic } });
}

export async function removeWishlistItem(productId) {
  const basic = getBasicCreds();
  return apiClient.del(`${base}/?productId=${encodeURIComponent(productId)}`, { auth: { basic } });
}
