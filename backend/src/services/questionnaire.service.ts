import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionnaireDto } from '../dtos/create-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prisma.questionnaire.findMany({ where: { tenantId } });
  }

  async findById(id: string) {
    return this.prisma.questionnaire.findUnique({ where: { id } });
  }

  async create(dto: CreateQuestionnaireDto) {
    return this.prisma.questionnaire.create({ data: dto });
  }

  async update(id: string, data: any) {
    return this.prisma.questionnaire.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.questionnaire.delete({ where: { id } });
  }
}
