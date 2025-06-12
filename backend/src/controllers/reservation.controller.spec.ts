import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from '@/services/reservation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            getCalendarReservations: jest.fn(),
            deleteReservation: jest.fn(),
            update: jest.fn(),
          },
        },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = moduleRef.get<ReservationController>(ReservationController);
  });

  it('should throw ForbiddenException when tenantId mismatch', async () => {
    const req: any = { user: { tenantId: 'tenant-a' } };
    await expect(
      controller.getCalendarReservations('2024-01-01', '2024-01-02', 'tenant-b', req, undefined),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('passes tenantId to deleteReservation', async () => {
    const service = moduleRef.get<ReservationService>(ReservationService);
    const req: any = { user: { tenantId: 't1' } };
    await controller.deleteReservation('r1', req);
    expect(service.deleteReservation).toHaveBeenCalledWith('r1', 't1');
  });

  it('passes tenantId to updateReservation', async () => {
    const service = moduleRef.get<ReservationService>(ReservationService);
    const req: any = { user: { tenantId: 't2' } };
    const dto: any = { date: '2024-01-01' };
    await controller.updateReservation('r2', dto, req);
    expect(service.update).toHaveBeenCalledWith('r2', dto, 't2');
  });
});
