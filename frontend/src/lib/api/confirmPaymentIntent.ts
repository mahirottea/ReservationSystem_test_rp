import apiClient from '../apiClient';

export default async function confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
  const res = await apiClient.post('/payments/confirm', {
    paymentIntentId,
    paymentMethodId,
  });
  return res.data as { status: string };
}
