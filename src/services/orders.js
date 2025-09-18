import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/admin/orders';
const userBase = '/api/orders';

export async function listAdminOrders({ page = 0, size = 20 } = {}) {
  const basic = getBasicCreds();
  const params = new URLSearchParams({ page, size });
  return apiClient.get(`${base}/?${params.toString()}`, { auth: { basic } });
}

export async function updateOrderStatus(id, status) {
  const basic = getBasicCreds();
  return apiClient.put(`${base}/${id}/status`, { status }, { auth: { basic } });
}

export async function updatePaymentStatus(id, paymentStatus) {
  const basic = getBasicCreds();
  return apiClient.put(`${base}/${id}/payment-status`, { paymentStatus }, { auth: { basic } });
}

// User endpoints
export async function listUserOrders() {
  const basic = getBasicCreds();
  // GET /api/orders/
  return apiClient.get(`${userBase}/`, { auth: { basic } });
}

export async function createUserOrder({ items, shippingAddress, paymentMethod, totalAmount, paymentProvider, senderNumber, transactionId }) {
  const basic = getBasicCreds();
  const body = {
    items,
    shippingAddress,
    paymentMethod,
    totalAmount,
    paymentProvider,
    senderNumber,
    transactionId,
  };
  return apiClient.post(`${userBase}/`, body, { auth: { basic } });
}
