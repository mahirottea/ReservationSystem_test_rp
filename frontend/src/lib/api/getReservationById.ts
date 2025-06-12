import apiClient from '@/lib/apiClient';

export default async function getReservationById(id: string) {
  const response = await apiClient.get(`/reservations/${id}`);
  return response.data;
}