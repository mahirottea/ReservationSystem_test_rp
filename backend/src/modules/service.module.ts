import { Module } from '@nestjs/common';
import { ServiceController } from '../controllers/service.controller';
import { ServiceService } from '../services/service.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService],
  exports: [ServiceService],
})
export class ServiceModule {}
