import { Module } from '@nestjs/common';
import { CouponController } from '../controllers/coupon.controller';
import { CouponService } from '../services/coupon.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, PrismaService],
  exports: [CouponService],
})
export class CouponModule {}
