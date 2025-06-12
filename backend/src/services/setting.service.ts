import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSettingDto } from '../dtos/create-setting.dto';

@Injectable()
export class SettingService {

  constructor(private readonly prisma: PrismaService) {}

  // ✅ 新規登録（POST /settings）
  async create(dto: CreateSettingDto) {
    const created = await this.prisma.setting.create({
      data: dto,
    });

    return {
      message: '設定を保存しました',
      settingId: created.id,
    };
  }

  // ✅ tenantId に紐づく設定の取得（GET /settings?tenantId=...）
  async findByTenantId(tenantId: string) {
    return this.prisma.setting.findUnique({
      where: { tenantId },
    });
  }

  // ✅ tenantId による upsert（存在すれば更新、なければ作成）
  async upsertByTenantId(tenantId: string, data: any) {
    return this.prisma.setting.upsert({
      where: { tenantId },
      update: data,
      create: { ...data, tenantId },
    });
  }

  // ✅ 更新用（明示的に ID で update したい場合用）
  async update(tenantId: string, data: any) {
    const existing = await this.prisma.setting.findUnique({
      where: { tenantId },
    });

    if (!existing) {
      throw new NotFoundException(`設定が見つかりません: ${tenantId}`);
    }

    return this.prisma.setting.update({
      where: { tenantId },
      data,
    });
  }
}
