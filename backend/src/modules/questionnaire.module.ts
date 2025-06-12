import { Module } from '@nestjs/common';
import { QuestionnaireService } from '../services/questionnaire.service';
import { QuestionnaireController } from '../controllers/questionnaire.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, PrismaService],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
