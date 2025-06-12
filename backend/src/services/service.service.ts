import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from '../dtos/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany();
  }

  async create(data: { name: string; duration: number; price: number; tenantId: string }) {
    return this.prisma.service.create({ data });
  }

  async getAllServices() {
    return this.prisma.service.findMany({
      select: { id: true, name: true },
    });
  }

  async createMany(services: CreateServiceDto[]) {
    const result = await this.prisma.service.createMany({
      data: services,
      skipDuplicates: true,
    });

    return {
      message: `${result.count} 件のメニューを登録しました`,
    };
  }

  async findByTenantId(tenantId: string) {
    return this.prisma.service.findMany({
     where: { tenantId },
    });
  }

  async deleteByTenantId(tenantId: string) {
    await this.prisma.service.deleteMany({ where: { tenantId } });
  }
}