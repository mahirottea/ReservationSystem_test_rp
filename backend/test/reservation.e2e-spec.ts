import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationController } from '../src/controllers/reservation.controller';
import { ReservationService } from '../src/services/reservation.service';
import { PaymentService } from '../src/services/payment.service';
import { NotificationService } from '../src/services/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

describe('ReservationController (e2e)', () => {
  let app: INestApplication;
  const prisma: any = {
    setting: { findUnique: jest.fn().mockResolvedValue(null) },
    staff: { findUnique: jest.fn().mockResolvedValue({ maxSlots: 5 }) },
    reservation: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({ id: 'res1' }),
      findUnique: jest.fn().mockResolvedValue({ tenantId: 't1', status: 'reserved', customerId: 'c1' }),
      update: jest.fn().mockResolvedValue({ id: 'res1' }),
    },
    reservationItem: {
      createMany: jest.fn().mockResolvedValue(null),
      deleteMany: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([{ service: { price: 100 } }]),
    },
    sale: {
      create: jest.fn().mockResolvedValue({ id: 'sale1' }),
      findUnique: jest.fn().mockResolvedValue({ id: 'sale1', amount: 100, paymentIntentId: 'pi_1' }),
      update: jest.fn().mockResolvedValue(null),
      deleteMany: jest.fn(),
    },
    customer: { findUnique: jest.fn().mockResolvedValue({ email: 'to@test' }) },
  };

  const paymentMock = {
    createPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_1' }),
    refundPayment: jest.fn().mockResolvedValue(null),
  };

  const notificationMock = {
    sendReservationConfirmation: jest.fn().mockResolvedValue(null),
    sendReservationCancellation: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prisma },
        { provide: PaymentService, useValue: paymentMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { tenantId: 't1' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  it('/reservations (POST)', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .send({
        customerId: 'c1',
        staffId: 's1',
        serviceIds: ['svc1'],
        tenantId: 't1',
        date: '2024-01-01T00:00:00.000Z',
      })
      .expect(201)
      .expect({ id: 'res1' });

    expect(prisma.reservation.create).toHaveBeenCalled();
  });

  it('confirm reservation triggers payment intent and email', async () => {
    await request(app.getHttpServer())
      .put('/reservations/res1')
      .send({
        customerId: 'c1',
        staffId: 's1',
        serviceIds: ['svc1'],
        date: '2024-01-01T00:00:00.000Z',
        status: 'confirmed',
      })
      .expect(200);

    expect(paymentMock.createPaymentIntent).toHaveBeenCalled();
    expect(notificationMock.sendReservationConfirmation).toHaveBeenCalled();
  });

  it('cancel reservation triggers refund and email', async () => {
    await request(app.getHttpServer())
      .put('/reservations/res1')
      .send({
        customerId: 'c1',
        staffId: 's1',
        serviceIds: ['svc1'],
        date: '2024-01-01T00:00:00.000Z',
        status: 'cancelled',
      })
      .expect(200);

    expect(paymentMock.refundPayment).toHaveBeenCalledWith('pi_1', 90);
    expect(notificationMock.sendReservationCancellation).toHaveBeenCalled();
  });
});
