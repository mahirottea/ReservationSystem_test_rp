import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimeSlotPriceDto } from '../dtos/create-timeslot-price.dto';

@Injectable()
export class TimeSlotPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.timeSlotPrice.findMany({ where: { tenantId } });
  }

  async findById(id: string) {
    return this.prisma.timeSlotPrice.findUnique({ where: { id } });
  }

  async create(dto: CreateTimeSlotPriceDto) {
    return this.prisma.timeSlotPrice.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.timeSlotPrice.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.timeSlotPrice.delete({ where: { id } });
  }
}
