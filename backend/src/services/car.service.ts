import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarSettingDto } from '../dtos/create-car-setting.dto';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.carSetting.findUnique({
      where: { tenantId },
      include: { carItems: true },
    });
  }

  async findById(id: string) {
    return this.prisma.carSetting.findUnique({
      where: { id },
      include: { carItems: true },
    });
  }

  async create(dto: CreateCarSettingDto) {
    return this.prisma.carSetting.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.carSetting.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.carSetting.delete({ where: { id } });
  }
}
