import { ReservationService } from './reservation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('ReservationService.deleteReservation', () => {
  it('should delete sales before deleting reservation', async () => {
    const prisma = {
      reservation: { findUnique: jest.fn().mockResolvedValue({ tenantId: 't1' }), delete: jest.fn().mockResolvedValue(undefined) },
      reservationItem: { deleteMany: jest.fn().mockResolvedValue(undefined) },
      sale: { deleteMany: jest.fn().mockResolvedValue(undefined) },
    } as any;

    const service = new ReservationService(prisma, {} as any, {} as any);

    await service.deleteReservation('res-id', 't1');

    expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: 'res-id' }, select: { tenantId: true } });
    expect(prisma.reservationItem.deleteMany).toHaveBeenCalledWith({ where: { reservationId: 'res-id' } });
    expect(prisma.sale.deleteMany).toHaveBeenCalledWith({ where: { reservationId: 'res-id' } });
    expect(prisma.reservation.delete).toHaveBeenCalledWith({ where: { id: 'res-id' } });
  });

  it('throws ForbiddenException when tenant mismatch', async () => {
    const prisma = {
      reservation: { findUnique: jest.fn().mockResolvedValue({ tenantId: 't1' }) },
    } as any;
    const service = new ReservationService(prisma, {} as any, {} as any);

    await expect(service.deleteReservation('r1', 't2')).rejects.toBeInstanceOf(ForbiddenException);
  });
});

describe('ReservationService.update', () => {
  it('throws ForbiddenException when tenant mismatch', async () => {
    const prisma: any = {
      reservation: {
        findUnique: jest.fn().mockResolvedValue({ tenantId: 't1', status: 'pending', customerId: 'c1' }),
        update: jest.fn(),
      },
      reservationItem: { deleteMany: jest.fn() },
      sale: { findUnique: jest.fn(), update: jest.fn() },
    } as any;

    const service = new ReservationService(prisma, {} as any, {} as any);
    const dto: any = { date: '2024-01-01' };

    await expect(service.update('r1', dto, 't2')).rejects.toBeInstanceOf(ForbiddenException);
  });
});
