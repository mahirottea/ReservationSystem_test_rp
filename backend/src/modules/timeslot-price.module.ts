import { Module } from '@nestjs/common';
import { TimeSlotPriceService } from '../services/timeslot-price.service';
import { TimeSlotPriceController } from '../controllers/timeslot-price.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TimeSlotPriceController],
  providers: [TimeSlotPriceService, PrismaService],
  exports: [TimeSlotPriceService],
})
export class TimeSlotPriceModule {}
