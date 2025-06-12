import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSeatTypeDto } from '../dtos/create-seat-type.dto';

@Injectable()
export class SeatTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.seatType.findMany({ where: { tenantId } });
  }

  async findById(id: string) {
    return this.prisma.seatType.findUnique({ where: { id } });
  }

  async create(dto: CreateSeatTypeDto) {
    return this.prisma.seatType.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.seatType.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.seatType.delete({ where: { id } });
  }
}
