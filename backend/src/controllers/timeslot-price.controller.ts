import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { TimeSlotPriceService } from '../services/timeslot-price.service';
import { CreateTimeSlotPriceDto } from '../dtos/create-timeslot-price.dto';
import { UpdateTimeSlotPriceDto } from '../dtos/update-timeslot-price.dto';

@Controller('timeslot-prices')
export class TimeSlotPriceController {
  constructor(private readonly timeSlotPriceService: TimeSlotPriceService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.timeSlotPriceService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.timeSlotPriceService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateTimeSlotPriceDto) {
    return this.timeSlotPriceService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTimeSlotPriceDto) {
    return this.timeSlotPriceService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.timeSlotPriceService.remove(id);
  }
}
