import { Controller, Post, Body, Get, Query, Put, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CouponService } from '@/services/coupon.service';
import { CreateCouponDto } from '@/dtos/create-coupon.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.couponService.findByTenantId(tenantId);
  }

  @Put(':tenantId')
  async upsert(@Param('tenantId') tenantId: string, @Body() dto: CreateCouponDto) {
    return this.couponService.upsertByTenantId(tenantId, dto);
  }
}
