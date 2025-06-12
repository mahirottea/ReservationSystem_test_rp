import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from '@/services/notification.service';
import { SettingService } from '@/services/setting.service';
import { UpdateNotificationSettingDto } from '../dtos/update-notification-setting.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notify: NotificationService,
    private readonly settingService: SettingService,
  ) {}

  @Post('test')
  async sendTest(@Body('email') email: string) {
    await this.notify.sendEmail(email, 'Test Email', 'This is a test notification');
    return { message: 'Test email sent' };
  }

  @Put('settings')
  async updateSettings(@Body() dto: UpdateNotificationSettingDto) {
    await this.settingService.upsertByTenantId(dto.tenantId, {
      notifyReservation: dto.notifyReservation,
      notifyReminder: dto.notifyReminder,
    });
    return { message: 'Notification settings updated' };
  }
}
