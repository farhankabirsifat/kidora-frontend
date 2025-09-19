import { apiClient } from './apiClient';
import { getBasicCreds, getToken } from './auth';

export async function getPaymentConfig() {
  return apiClient.get('/api/payments/config');
}

function adminAuthOpts() {
  const basic = getBasicCreds();
  if (basic) return { auth: { basic } };
  const bearer = getToken();
  if (bearer) return { auth: { bearer } };
  return {}; // unauthenticated (will 401)
}

export async function getAdminPaymentConfig() {
  return apiClient.get('/api/admin/payments/config', adminAuthOpts());
}

export async function updateAdminPaymentConfig(data) {
  return apiClient.put('/api/admin/payments/config', data, adminAuthOpts());
}
