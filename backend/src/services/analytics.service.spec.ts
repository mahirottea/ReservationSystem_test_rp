import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService.getSummary', () => {
  it('aggregates totals', async () => {
    const prisma = {
      sale: { aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 100 } }) },
      reservation: { count: jest.fn().mockResolvedValue(2) },
    } as any;
    const service = new AnalyticsService(prisma as PrismaService);
    const result = await service.getSummary('t1');
    expect(prisma.sale.aggregate).toHaveBeenCalled();
    expect(prisma.reservation.count).toHaveBeenCalledWith({ where: { tenantId: 't1' } });
    expect(result).toEqual({ totalSales: 100, totalReservations: 2 });
  });
});
