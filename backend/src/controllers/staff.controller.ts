import { Controller, Get, Post, Body, Query, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto } from '../dtos/create-staff.dto';
import { UpdateStaffDto } from '../dtos/update-staff.dto';
import { StaffService } from '@/services/staff.service';

@UseGuards(AuthGuard('jwt'))
@Controller('staffs')
export class StaffController {
  constructor(private prisma: PrismaService, private readonly staffService: StaffService) {}

  @Get()
  async getStaffs(@Query('tenantId') tenantId?: string) {
    if (tenantId) {
      return this.staffService.findByTenantId(tenantId);
    }

    return this.prisma.staff.findMany({
      select: { id: true, name: true },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.staffService.findById(id);
  }


  @Post()
  async createMany(@Body() staffList: CreateStaffDto[]) {
    return this.staffService.createMany(staffList);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
