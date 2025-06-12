import { IsString, IsOptional } from 'class-validator';

export class UpdateQuestionnaireDto {
  @IsOptional()
  @IsString()
  question?: string;
}
