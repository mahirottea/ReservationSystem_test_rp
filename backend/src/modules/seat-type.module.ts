import { Module } from '@nestjs/common';
import { SeatTypeService } from '../services/seat-type.service';
import { SeatTypeController } from '../controllers/seat-type.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SeatTypeController],
  providers: [SeatTypeService, PrismaService],
  exports: [SeatTypeService],
})
export class SeatTypeModule {}
