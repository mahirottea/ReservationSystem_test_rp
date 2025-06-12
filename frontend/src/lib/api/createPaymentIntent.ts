import apiClient from '../apiClient';

export default async function createPaymentIntent(amount: number, reservationId: string) {
  const res = await apiClient.post('/payments/intents', { amount, reservationId });
  return res.data as { clientSecret: string; paymentIntentId: string };
}
