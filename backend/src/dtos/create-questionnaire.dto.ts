import { IsString } from 'class-validator';

export class CreateQuestionnaireDto {
  @IsString()
  question: string;

  @IsString()
  tenantId: string;
}
