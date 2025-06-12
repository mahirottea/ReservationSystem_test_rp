import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { PaymentController } from '../src/controllers/payment.controller';
import { PaymentService } from '../src/services/payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  const paymentMock = {
    createPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_1', client_secret: 'secret' }),
    confirmPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_1', status: 'succeeded' }),
    constructEvent: jest.fn(),
  };
  const prismaMock = {
    sale: {
      upsert: jest.fn().mockResolvedValue(null),
      updateMany: jest.fn().mockResolvedValue(null),
    },
  };

  describe('authorized access', () => {
    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [PaymentController],
        providers: [
          { provide: PaymentService, useValue: paymentMock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => true })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
      jest.clearAllMocks();
    });

    it('/payments/intents (POST) authorized', async () => {
      await request(app.getHttpServer())
        .post('/payments/intents')
        .send({ amount: 100, reservationId: 'res1' })
        .expect(201)
        .expect({ clientSecret: 'secret', paymentIntentId: 'pi_1' });

      expect(paymentMock.createPaymentIntent).toHaveBeenCalledWith(100, 'res1');
    });

    it('/payments/confirm (POST) authorized', async () => {
      await request(app.getHttpServer())
        .post('/payments/confirm')
        .send({ paymentIntentId: 'pi_1', paymentMethodId: 'pm_1' })
        .expect(201)
        .expect({ status: 'succeeded' });

      expect(paymentMock.confirmPaymentIntent).toHaveBeenCalledWith('pi_1', 'pm_1');
    });
  });

  describe('unauthorized access', () => {
    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [PaymentController],
        providers: [
          { provide: PaymentService, useValue: paymentMock },
          { provide: PrismaService, useValue: prismaMock },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/payments/intents (POST) unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/payments/intents')
        .send({ amount: 100, reservationId: 'res1' })
        .expect(401);
    });

    it('/payments/confirm (POST) unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/payments/confirm')
        .send({ paymentIntentId: 'pi_1', paymentMethodId: 'pm_1' })
        .expect(401);
    });
  });
});
