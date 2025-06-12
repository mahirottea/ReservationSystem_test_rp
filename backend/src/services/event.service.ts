import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from '../dtos/create-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.event.findMany({
      where: { tenantId },
      include: { tickets: true },
    });
  }

  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { tickets: true },
    });
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.event.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
