import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { SchoolService } from '../services/school.service';
import { CreateSchoolSettingDto } from '../dtos/create-school-setting.dto';

@Controller('school-settings')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.schoolService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.schoolService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateSchoolSettingDto) {
    return this.schoolService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.schoolService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }
}
