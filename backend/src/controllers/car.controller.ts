import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { CarService } from '../services/car.service';
import { CreateCarSettingDto } from '../dtos/create-car-setting.dto';

@Controller('car-settings')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.carService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.carService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCarSettingDto) {
    return this.carService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
