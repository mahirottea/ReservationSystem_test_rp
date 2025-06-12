import apiClient from '../apiClient';

export async function fetchCarSetting(tenantId: string) {
  const res = await apiClient.get('/car-settings', { params: { tenantId } });
  return res.data;
}

export async function createCarSetting(data: any) {
  const res = await apiClient.post('/car-settings', data);
  return res.data;
}

export async function updateCarSetting(id: string, data: any) {
  const res = await apiClient.put(`/car-settings/${id}`, data);
  return res.data;
}

export async function deleteCarSetting(id: string) {
  const res = await apiClient.delete(`/car-settings/${id}`);
  return res.data;
}
