import { Controller, Post, Get, Body, Query, Param , Put, NotFoundException  } from '@nestjs/common';
import { SettingService } from '@/services/setting.service';
import { CreateSettingDto } from '../dtos/create-setting.dto';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  // ✅ POST /settings
  @Post()
  async create(@Body() dto: CreateSettingDto) {
    return this.settingService.create(dto);
  }

  // ✅ GET /settings?tenantId=xxxxx
  @Get()
  async findByTenantId(@Query('tenantId') tenantId: string) {
    const setting = await this.settingService.findByTenantId(tenantId);
    if (!setting) {
      throw new NotFoundException('設定が見つかりません');
    }
    return setting;
  }

  // ✅ PUT /settings/:tenantId
  @Put(':tenantId')
  async updateSetting(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateSettingDto
  ) {
    return this.settingService.update(tenantId, dto);
  }
}
