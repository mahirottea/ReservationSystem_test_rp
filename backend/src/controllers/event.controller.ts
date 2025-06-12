import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dtos/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.eventService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.eventService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
