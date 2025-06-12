import apiClient from '../apiClient';

export async function fetchSchoolSetting(tenantId: string) {
  const res = await apiClient.get('/school-settings', { params: { tenantId } });
  return res.data;
}

export async function createSchoolSetting(data: any) {
  const res = await apiClient.post('/school-settings', data);
  return res.data;
}

export async function updateSchoolSetting(id: string, data: any) {
  const res = await apiClient.put(`/school-settings/${id}`, data);
  return res.data;
}

export async function deleteSchoolSetting(id: string) {
  const res = await apiClient.delete(`/school-settings/${id}`);
  return res.data;
}
