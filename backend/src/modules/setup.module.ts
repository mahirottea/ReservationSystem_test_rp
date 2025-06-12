import { Module } from '@nestjs/common';
import { SetupController } from '../controllers/setup.controller';
import { PrismaService } from '../../prisma/prisma.service';

import { TenantService } from '../services/tenant.service';
import { UserService } from '../services/user.service';
import { SettingService } from '../services/setting.service';
import { StaffService } from '../services/staff.service';
import { ServiceService } from '../services/service.service';
import { CouponService } from '../services/coupon.service';

@Module({
  controllers: [SetupController],
  providers: [
    PrismaService,
    TenantService,
    UserService,
    SettingService,
    StaffService,
    ServiceService,
    CouponService,
  ],
})
export class SetupModule {}
