import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCouponDto) {
    const created = await this.prisma.coupon.create({
      data: dto,
    });

    return {
      message: 'クーポンを登録しました',
      couponId: created.id,
    };
  }

  async findByTenantId(tenantId: string) {
    return this.prisma.coupon.findMany({
        where: { tenantId },
    });
  }
  async upsertByTenantId(tenantId: string, data: any) {
    return this.prisma.coupon.upsert({
      where: { tenantId },
      update: data,
      create: { ...data, tenantId },
    });
  }
}