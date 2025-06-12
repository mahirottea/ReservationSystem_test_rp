import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServiceService } from '@/services/service.service';
import { CreateServiceDto } from '@/dtos/create-service.dto';
import { PrismaService } from '../../prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService, private prisma: PrismaService) {}

  @Get('all')
  async findAll() {
    return this.serviceService.findAll();
  }

  @Post()
  async create(@Body() body: CreateServiceDto) {
    return this.serviceService.create(body);
  }

  @Get()
  async getServices(@Query('tenantId') tenantId?: string) {
    if (tenantId) {
      return this.serviceService.findByTenantId(tenantId);
    }
    return this.serviceService.getAllServices();
  }

  @Post('bulk')
  async createMany(@Body() services: CreateServiceDto[]) {
    return this.serviceService.createMany(services);
  }
}