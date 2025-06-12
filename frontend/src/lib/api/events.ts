import apiClient from '../apiClient';

export async function fetchEvents(tenantId: string) {
  const res = await apiClient.get('/events', { params: { tenantId } });
  return res.data;
}

export async function fetchEvent(id: string) {
  const res = await apiClient.get(`/events/${id}`);
  return res.data;
}

export async function createEvent(data: any) {
  const res = await apiClient.post('/events', data);
  return res.data;
}

export async function updateEvent(id: string, data: any) {
  const res = await apiClient.put(`/events/${id}`, data);
  return res.data;
}

export async function deleteEvent(id: string) {
  const res = await apiClient.delete(`/events/${id}`);
  return res.data;
}
