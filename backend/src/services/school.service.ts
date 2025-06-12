import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolSettingDto } from '../dtos/create-school-setting.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.schoolSetting.findUnique({
      where: { tenantId },
      include: { lessons: true, instructors: true },
    });
  }

  async findById(id: string) {
    return this.prisma.schoolSetting.findUnique({
      where: { id },
      include: { lessons: true, instructors: true },
    });
  }

  async create(dto: CreateSchoolSettingDto) {
    return this.prisma.schoolSetting.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.schoolSetting.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.schoolSetting.delete({ where: { id } });
  }
}
