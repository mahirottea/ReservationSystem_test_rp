import { Module } from '@nestjs/common';
import { SettingController } from '../controllers/setting.controller';
import { SettingService } from '../services/setting.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SettingController],
  providers: [SettingService, PrismaService],
  exports: [SettingService],
})
export class SettingModule {}
