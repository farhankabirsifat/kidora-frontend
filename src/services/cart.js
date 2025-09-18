import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/cart';

export async function getCart() {
  const basic = getBasicCreds();
  return apiClient.get(`${base}/`, { auth: { basic } });
}

export async function addOrUpdateCartItem({ productId, selectedSize, quantity }) {
  const basic = getBasicCreds();
  return apiClient.post(`${base}/`, { productId, selectedSize, quantity }, { auth: { basic } });
}

export async function removeCartItem({ productId, selectedSize }) {
  const basic = getBasicCreds();
  return apiClient.del(`${base}/?productId=${encodeURIComponent(productId)}&selectedSize=${encodeURIComponent(selectedSize)}`, { auth: { basic } });
}

export async function clearCart() {
  const basic = getBasicCreds();
  return apiClient.del(`${base}/clear`, { auth: { basic } });
}
