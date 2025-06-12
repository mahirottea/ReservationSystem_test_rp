import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('summary')
  async getSummary(@Query('tenantId') tenantId: string) {
    return this.service.getSummary(tenantId);
  }
}
