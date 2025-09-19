import { apiClient } from './apiClient';
import { getBasicCreds } from './auth';

const base = '/api/admin/users';

export async function listAdminUsers() {
  const basic = getBasicCreds();
  return apiClient.get(`${base}/`, { auth: { basic } });
}

export async function updateUserRole(id, role) {
  const basic = getBasicCreds();
  return apiClient.put(`${base}/${id}/role`, { role }, { auth: { basic } });
}
