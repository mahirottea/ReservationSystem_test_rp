import { Module } from '@nestjs/common';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { SettingModule } from './setting.module';

@Module({
  imports: [SettingModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
