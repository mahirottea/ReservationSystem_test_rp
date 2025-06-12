import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    const apiVersion =
      (process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion) ||
      '2024-04-10';
    this.stripe = new Stripe(key, { apiVersion });
  }

  async createPaymentIntent(amount: number, reservationId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'jpy',
      metadata: { reservationId },
    });
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount ? { amount } : {}),
    });
  }

  constructEvent(payload: Buffer, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
