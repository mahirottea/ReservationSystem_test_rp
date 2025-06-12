import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  const stripeMock = {
    paymentIntents: {
      create: jest.fn(),
      confirm: jest.fn(),
    },
    refunds: {
      create: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  } as any;

  beforeEach(() => {
    service = new PaymentService();
    (service as any).stripe = stripeMock;
    jest.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec';
  });

  it('creates payment intent with metadata', async () => {
    await service.createPaymentIntent(1000, 'res-1');
    expect(stripeMock.paymentIntents.create).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'jpy',
      metadata: { reservationId: 'res-1' },
    });
  });

  it('confirms payment intent', async () => {
    await service.confirmPaymentIntent('pi_1', 'pm_1');
    expect(stripeMock.paymentIntents.confirm).toHaveBeenCalledWith('pi_1', {
      payment_method: 'pm_1',
    });
  });

  it('refunds payment with amount', async () => {
    await service.refundPayment('pi_1', 500);
    expect(stripeMock.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_1',
      amount: 500,
    });
  });

  it('refunds payment without amount', async () => {
    await service.refundPayment('pi_1');
    expect(stripeMock.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_1',
    });
  });

  it('constructs event with webhook secret', () => {
    const payload = Buffer.from('data');
    stripeMock.webhooks.constructEvent.mockReturnValue({ id: 'evt_1' });
    const event = service.constructEvent(payload, 'sig');
    expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledWith(payload, 'sig', 'whsec');
    expect(event).toEqual({ id: 'evt_1' });
  });
});
