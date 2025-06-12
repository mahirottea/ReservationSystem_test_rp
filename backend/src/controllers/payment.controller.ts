import { Controller, Post, Body, Req, Headers, UseGuards } from '@nestjs/common';
import { PaymentService } from '@/services/payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import Stripe from 'stripe';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@/decorators/public.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private payment: PaymentService, private prisma: PrismaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('intents')
  async createIntent(
    @Body('amount') amount: number,
    @Body('reservationId') reservationId: string,
  ) {
    const intent = await this.payment.createPaymentIntent(amount, reservationId);
    await this.prisma.sale.upsert({
      where: { reservationId },
      update: { amount, paymentIntentId: intent.id },
      create: {
        reservationId,
        amount,
        paymentIntentId: intent.id,
        paymentStatus: 'pending',
      },
    });
    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('confirm')
  async confirmIntent(
    @Body('paymentIntentId') paymentIntentId: string,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    const intent = await this.payment.confirmPaymentIntent(
      paymentIntentId,
      paymentMethodId,
    );
    await this.prisma.sale.updateMany({
      where: { paymentIntentId },
      data: {
        paymentStatus: intent.status === 'succeeded' ? 'paid' : 'failed',
      },
    });
    return { status: intent.status };
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const payload = (req as any).rawBody as Buffer;
    const event = this.payment.constructEvent(payload, sig);

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const reservationId = intent.metadata?.reservationId;
      if (reservationId) {
        await this.prisma.sale.updateMany({
          where: { reservationId },
          data: { paymentStatus: 'paid' },
        });
      }
    }
    return { received: true };
  }
}
