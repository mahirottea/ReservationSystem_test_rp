import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(tenantId: string) {
    const totalSales = await this.prisma.sale.aggregate({
      _sum: { amount: true },
      where: { reservation: { tenantId } },
    });
    const totalReservations = await this.prisma.reservation.count({ where: { tenantId } });
    return { totalSales: totalSales._sum.amount || 0, totalReservations };
  }
}
