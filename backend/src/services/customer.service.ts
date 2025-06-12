import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        tenantId: dto.tenantId,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }
  
  async findByEmail(email: string) {
    return this.prisma.customer.findFirst({ where: { email } });
  } 

  async findByEmailAndTenant(email: string, tenantId: string) {
    return this.prisma.customer.findMany({
      where: { email, tenantId }
    });
  }

}
