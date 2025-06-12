import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '@/dtos/create-customer.dto';
import { UpdateCustomerDto } from '@/dtos/update-customer.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()

  async find(
    @Query('email') email?: string,
    @Query('tenantId') tenantId?: string
    ) {
    if (email && tenantId) {
      return this.customerService.findByEmailAndTenant(email, tenantId);
    }
    if (tenantId) {
      return this.customerService.findAll(tenantId);
    }
    return []; // 不正リクエスト時など
  }

  @Post()

  async create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @Get(':id')
  
  async findById(@Param('id') id: string) {
    return this.customerService.findById(id);
  }
}
