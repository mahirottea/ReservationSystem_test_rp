import { Module } from '@nestjs/common';
import { StaffController } from '../controllers/staff.controller';
import { StaffService } from '../services/staff.service';
import { PrismaService } from '../..//prisma/prisma.service';

@Module({
  controllers: [StaffController],
  providers: [StaffService, PrismaService],
  exports: [StaffService], // 他モジュールでも使う場合
})
export class StaffModule {}
