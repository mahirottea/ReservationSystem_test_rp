'use client';
import { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import createPaymentIntent from '@/lib/api/createPaymentIntent';
import confirmPaymentIntent from '@/lib/api/confirmPaymentIntent';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type Props = { amount: number; reservationId: string; onSuccess?: () => void };

function InnerForm({ amount, reservationId, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    if (amount > 0 && reservationId) {
      createPaymentIntent(amount, reservationId).then((d) => {
        setPaymentIntentId(d.paymentIntentId);
      });
    }
  }, [amount, reservationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !paymentIntentId) return;
    const pm = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });
    if (pm.error) return;
    await confirmPaymentIntent(paymentIntentId, pm.paymentMethod.id);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <CardElement className="border p-2" />
      <button type="submit" disabled={!stripe} className="bg-blue-600 text-white px-4 py-2 rounded">
        Pay
      </button>
    </form>
  );
}

export default function PaymentForm(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <InnerForm {...props} />
    </Elements>
  );
}
