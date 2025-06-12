import { Module } from '@nestjs/common';
import { EventController } from '../controllers/event.controller';
import { EventService } from '../services/event.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService],
  exports: [EventService],
})
export class EventModule {}
