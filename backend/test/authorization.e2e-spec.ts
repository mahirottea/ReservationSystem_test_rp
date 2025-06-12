import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';

import { CustomerController } from '../src/controllers/customer.controller';
import { StaffController } from '../src/controllers/staff.controller';
import { ServiceController } from '../src/controllers/service.controller';
import { CouponController } from '../src/controllers/coupon.controller';
import { NotificationController } from '../src/controllers/notification.controller';

import { CustomerService } from '../src/services/customer.service';
import { StaffService } from '../src/services/staff.service';
import { ServiceService } from '../src/services/service.service';
import { CouponService } from '../src/services/coupon.service';
import { NotificationService } from '../src/services/notification.service';
import { SettingService } from '../src/services/setting.service';
import { PrismaService } from '../prisma/prisma.service';

describe('Authorization Guards (e2e)', () => {
  describe('CustomerController unauthorized', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [CustomerController],
        providers: [
          { provide: CustomerService, useValue: {} },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/customers (GET) unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/customers')
        .expect(401);
    });
  });

  describe('StaffController unauthorized', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [StaffController],
        providers: [
          { provide: StaffService, useValue: {} },
          { provide: PrismaService, useValue: {} },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/staffs (GET) unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/staffs')
        .expect(401);
    });
  });

  describe('ServiceController unauthorized', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [ServiceController],
        providers: [
          { provide: ServiceService, useValue: {} },
          { provide: PrismaService, useValue: {} },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/services (POST) unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/services')
        .send({})
        .expect(401);
    });
  });

  describe('CouponController unauthorized', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [CouponController],
        providers: [
          { provide: CouponService, useValue: {} },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/coupons (POST) unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/coupons')
        .send({})
        .expect(401);
    });
  });

  describe('NotificationController unauthorized', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [NotificationController],
        providers: [
          { provide: NotificationService, useValue: {} },
          { provide: SettingService, useValue: {} },
        ],
      })
        .overrideGuard(AuthGuard('jwt'))
        .useValue({ canActivate: () => { throw new UnauthorizedException(); } })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('/notifications/test (POST) unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/notifications/test')
        .send({})
        .expect(401);
    });
  });
});

