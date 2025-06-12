import { Module } from '@nestjs/common';
import { CarController } from '../controllers/car.controller';
import { CarService } from '../services/car.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CarController],
  providers: [CarService, PrismaService],
  exports: [CarService],
})
export class CarModule {}
