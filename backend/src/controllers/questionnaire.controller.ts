import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { QuestionnaireService } from '../services/questionnaire.service';
import { CreateQuestionnaireDto } from '../dtos/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from '../dtos/update-questionnaire.dto';

@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get()
  async find(@Query('tenantId') tenantId: string) {
    return this.questionnaireService.findByTenantId(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.questionnaireService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateQuestionnaireDto) {
    return this.questionnaireService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionnaireDto) {
    return this.questionnaireService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionnaireService.remove(id);
  }
}
