import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[USER] findByEmail 実行:', email);
    }
    return this.prisma.user.findFirst({
      where: { 
        email:{
          equals: email,
          mode: 'insensitive',
        }, 
      },
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        tenantId: dto.tenantId,
        role: dto.role,
        subRole: dto.subRole,
      },
    });

    return {
      message: 'ユーザーを作成しました',
      userId: user.id,
    };
  }

  async findAdminByTenantId(tenantId: string) {
    return this.prisma.user.findFirst({
      where: {
        tenantId,
        role: 'admin',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async updateAdmin(tenantId: string, data: { name: string; email: string; password?: string }) {
    const existing = await this.prisma.user.findFirst({
      where: { tenantId, role: 'admin' }
    });

    const updated = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      updated['password'] = await bcrypt.hash(data.password, 10);
    }
    if (!existing) {
      throw new NotFoundException('管理ユーザーが見つかりません');
    }

    return this.prisma.user.update({
      where: { id: existing.id },
      data: updated,
    });
  }

}
