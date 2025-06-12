import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { SeatTypeService } from '../services/seat-type.service';
import { CreateSeatTypeDto } from '../dtos/create-seat-type.dto';
import { UpdateSeatTypeDto } from '../dtos/update-seat-type.dto';

@Controller('seat-types')
export class SeatTypeController {
  constructor(private readonly seatTypeService: SeatTypeService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.seatTypeService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.seatTypeService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateSeatTypeDto) {
    return this.seatTypeService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSeatTypeDto) {
    return this.seatTypeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.seatTypeService.remove(id);
  }
}
