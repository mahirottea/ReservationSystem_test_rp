import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto } from '../dtos/create-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async createMany(staffList: CreateStaffDto[]) {
    const created = await this.prisma.staff.createMany({
      data: staffList,
      skipDuplicates: true,
    });

    return {
      message: `${created.count} 名のスタッフを登録しました`,
    };
  }

  async findByTenantId(tenantId: string) {
    return this.prisma.staff.findMany({
      where: { tenantId },
    });
  }

  async findById(id: string) {
    return this.prisma.staff.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.staff.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.staff.delete({ where: { id } });
  }

  async deleteByTenantId(tenantId: string) {
    await this.prisma.staff.deleteMany({ where: { tenantId } });
  }
}
